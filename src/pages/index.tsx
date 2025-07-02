import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const MainPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleProcessClick = () => {
    const lines = inputValue.split("\n");
    const edited = lines
      .map((line) => {
        return line.replace(/<(va|v|q)>(.*)/, (match, tag, expr) => {
          expr = expr.trim();

          // Only process if it starts with a single backslash (e.g. \frac or \sqrt)
          if (expr.startsWith("\\")) {
            // Escape backslashes
            const escaped = expr.replace(/\\/g, "\\\\");
            return `<${tag}>$${escaped}$`;
          }

          // If already wrapped like $...$, leave it untouched
          if (expr.startsWith("$") && expr.endsWith("$")) {
            const inner = expr.slice(1, -1).replace(/\\/g, "\\\\");
            return `<${tag}>$${inner}$`;
          }

          // Leave all other content untouched
          return match;
        });
      })
      .join("\n");

    setOutputValue(edited);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(outputValue);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Grant Master Utils</CardTitle>
          <CardDescription>
            Утилита для обработки текста с LaTeX. Вставляет двойные обратные
            слэши (\\) вместо одинарных (\) в LaTeX выражениях.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Textarea
              placeholder="Вставьте текст сюда..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <Textarea
              placeholder="Результат..."
              value={outputValue}
              readOnly
              className="min-h-[300px] resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={handleProcessClick}>Обработать</Button>
          <Button onClick={handleCopyClick} disabled={!outputValue}>
            Копировать
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
