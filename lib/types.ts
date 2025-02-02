export interface Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
}

export interface SubmissionResponse {
  token: string;
}

export interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string;
  memory: number;
  status: {
    id: number;
    description: string;
  };
}

export interface Language {
  id: number;
  name: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 54, name: "cpp", label: "C++ (GCC 9.2.0)" },
  { id: 62, name: "java", label: "Java (OpenJDK 13.0.1)" },
  { id: 63, name: "javascript", label: "JavaScript (Node.js 12.14.0)" },
  { id: 71, name: "python", label: "Python (3.8.1)" },
];