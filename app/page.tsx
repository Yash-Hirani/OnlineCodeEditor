import CodeEditor from "@/components/code-editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#2c3e50] to-[#4ca1af] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Compiler</h1>
          <p className="text-xl pt-3  tracking-tight">
            Write, compile, and run code
          </p>
        </div>
        <CodeEditor />
      </div>
    </main>
  );
}
