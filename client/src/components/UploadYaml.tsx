import { useRef } from "react";
import { Link } from "lucide-react";
import { Button } from "./ui/button";
import { fetchTasks, uploadYaml } from "../api/tasks";

export default function UploadYaml() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadYaml(file);
      await fetchTasks();
    } catch (err) {
      console.error("Upload failed:", err);
    }

    e.currentTarget.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml,application/x-yaml,text/yaml"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        variant="secondary"
        className="flex-1"
        onClick={() => fileInputRef.current?.click()}
      >
        <Link className="h-4 w-4 mr-2" />
        Upload YAML
      </Button>
    </>
  );
}
