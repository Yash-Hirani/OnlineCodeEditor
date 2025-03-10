"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import { submitCode, getSubmissionResult } from "@/lib/judge0";
import { PlayIcon, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState(
    SUPPORTED_LANGUAGES[0].id.toString()
  );
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();

  const clearPollInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  function pollSubmission(token: string) {
    const test = async () => {
      try {
        const result = await getSubmissionResult(token);

        console.log(JSON.stringify(result));
        // Log the result to check what the API returns
        console.log("Judge0 API Response:", result);

        // Check if result is undefined or if the status object is missing or malformed
        if (!result || !result.status || typeof result.status.id !== "number") {
          // If the result doesn't have a valid status, log the error and return
          console.log(JSON.stringify(result));
          setIsLoading(false);
          setOutput("Error: Invalid response structure from Judge0.");
          return; // Prevent further execution
        }

        const statusId = result.status.id;

        // If the status is 1 (In Queue) or 2 (Processing), continue polling
        if (statusId === 1 || statusId === 2) {
          return;
        }

        // If the status is not 1 or 2, stop polling and process the result
        clearPollInterval();
        setIsLoading(false);

        let outputText = "";
        if (result.compile_output)
          outputText += `Compilation Error:\n${result.compile_output}\n`;
        if (result.stderr) outputText += `Error:\n${result.stderr}\n`;
        if (result.stdout) outputText += `Output:\n${result.stdout}\n`;
        if (result.message) outputText += `Message:\n${result.message}\n`;

        // Update the output
        setOutput(outputText || "No output");
      } catch (error) {
        console.error("Polling Error:", error);
        clearPollInterval();
        setIsLoading(false);
        setOutput("Error: Failed to get submission result");
        toast({
          title: "Error",
          //description: error.message || "Failed to get submission result",
          variant: "destructive",
        });
      }
    };
    test();
  }

  async function handleSubmit() {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code",
        variant: "destructive",
      });
      return;
    }

    clearPollInterval();
    setIsLoading(true);
    setOutput("");

    try {
      const token = await submitCode({
        source_code: code,
        language_id: parseInt(language),
        stdin: input,
      });

      if (!token) {
        throw new Error("Submission failed: No token received");
      }

      console.log("Received token:", token); // Log token to verify it

      intervalRef.current = setTimeout(() => pollSubmission(token), 2000);
    } catch (error) {
      console.error("Submission Error:", error);
      setIsLoading(false);
      setOutput("Error: Failed to submit code");
      toast({
        title: "Error",
        description: "Failed to submit code",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (!isLoading) {
      clearPollInterval();
    }
    return () => clearPollInterval();
  }, [isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center  gap-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[200px] bg-gray-400">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.id} value={lang.id.toString()}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="ml-auto flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {isLoading ? (
            "Running..."
          ) : (
            <>
              <PlayIcon className="mr-2 h-4 w-4" />
              <span className="transition-opacity duration-300 ease-in-out ">
                Run Code
              </span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Textarea
            placeholder="Write your code here..."
            className="font-mono min-h-[400px]"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Textarea
            placeholder="Input (optional)"
            className="min-h-[100px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 p-2 bg-muted flex items-center gap-2 rounded-t-md">
            <Terminal className="h-4 w-4" />
            <span className="text-sm font-medium">Output</span>
          </div>
          <Textarea
            readOnly
            className="font-mono min-h-[516px] pt-12"
            value={output}
            placeholder="Output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
