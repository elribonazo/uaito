import Editor from "@monaco-editor/react";
import { ChevronUp, ChevronDown, Trash2, Power } from "lucide-react";
import { useMemo, memo } from "react";
import { isEqual } from 'lodash';

import { extractFunctionAndRenderer, generateSchemaFromCode } from "../utils";
import type { Tool } from "./Chat";

interface ToolItemProps {
  tool: Tool;
  onToggleEnabled: () => void;
  onToggleCollapsed: () => void;
  onExpand: () => void;
  onDelete: () => void;
  onCodeChange: (newCode: string) => void;
}

const ToolItem: React.FC<ToolItemProps> = ({
  tool,
  onToggleEnabled,
  onToggleCollapsed,
  onDelete,
  onCodeChange,
}) => {
  const { functionCode } = extractFunctionAndRenderer(tool.code);
  const schema = useMemo(
    () => generateSchemaFromCode(functionCode),
    [functionCode],
  );

  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 transition-all ${!tool.enabled ? "opacity-50 grayscale" : ""}`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggleCollapsed}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleCollapsed();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Toggle ${schema.name} tool details`}
      >
        <div>
          <h3 className="text-lg font-bold text-teal-300 font-mono">
            {schema.name}
          </h3>
          <div className="text-xs text-gray-300 mt-1">{schema.description}</div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleEnabled();
            }}
            className={`p-1 rounded-full ${tool.enabled ? "text-green-400 hover:bg-green-900" : "text-red-400 hover:bg-red-900"}`}
          >
            <Power size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-600 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapsed();
            }}
            className="p-2 text-gray-400 hover:text-white"
          >
            {tool.isCollapsed ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronUp size={20} />
            )}
          </button>
        </div>
      </div>
      {!tool.isCollapsed && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="text-sm font-bold text-gray-400">
              Implementation & Renderer
            </div>
            <div
              className="mt-1 rounded-md overflow-visible border border-gray-600"
              style={{ overflow: "visible" }}
            >
              <Editor
                height="300px"
                language="javascript"
                theme="vs-dark"
                value={tool.code}
                onChange={(value) => onCodeChange(value || "")}
                options={{
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 10 },
                  fontSize: 14,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-bold text-gray-400">
              Generated Schema
            </div>
            <div className="mt-1 rounded-md flex-grow overflow-visible border border-gray-600">
              <Editor
                height="300px"
                language="json"
                theme="vs-dark"
                value={JSON.stringify(schema, null, 2)}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 10 },
                  lineNumbers: "off",
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 0,
                  scrollBeyondLastLine: false,
                  fontSize: 12,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ToolItem, isEqual);
