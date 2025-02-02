import { Submission, SubmissionResponse, SubmissionResult } from "./types";
const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = "426d62122bmsh6d18999c53d00dfp120408jsn20ee8a444698"; // You'll need to get this from RapidAPI

export async function submitCode(submission: Submission): Promise<string> {
  const response = await fetch(`${JUDGE0_API}/submissions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    body: JSON.stringify({
      ...submission,
      redirect_stderr_to_stdout: false,
    }),
  });

  const data: SubmissionResponse = await response.json();
  return data.token;
}

export async function getSubmissionResult(token: string): Promise<SubmissionResult> {
  const response = await fetch(
    `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
    {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    }
  );

  return response.json();
}