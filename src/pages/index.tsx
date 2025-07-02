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
import { toast } from "sonner";

export const MainPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleProcessClick = () => {
    const lines = inputValue.split("\n");
    const edited = lines
      .map((line) => {
        return line.replace(
          /<(va|v|q)>(.*)/,
          (match: string, tag: string, expr: string) => {
            expr = expr.trim();

            // Case 1: already has $...$, escape backslashes inside them only
            if (expr.includes("$")) {
              // Replace content inside $...$ only
              expr = expr.replace(/\$(.*?)\$/g, (_, latex) => {
                const escaped = latex.replace(/\\/g, "\\\\");
                return `$${escaped}$`;
              });
              return `<${tag}>${expr}`;
            }

            // Case 2: if starts with \ → wrap and escape
            if (expr.startsWith("\\")) {
              const escaped = expr.replace(/\\/g, "\\\\");
              return `<${tag}>$${escaped}$`;
            }

            // Case 3: leave untouched
            return match;
          }
        );
      })
      .join("\n");

    navigator.clipboard.writeText(outputValue);
    setOutputValue(edited);
    toast.success("Текст отформатирован и скопирован");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(outputValue);
    toast.success("Текст скопирован");
  };

  const handleReset = () => {
    setInputValue("");
    setOutputValue("");
    toast.success("Текст очищен");
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
          <Button variant={"destructive"} onClick={handleReset}>
            Очистить
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
