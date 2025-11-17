import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

function Component() {
  return (
    <NodeViewWrapper className="draggable-item">
      <div className="drag-handle" contentEditable={false} draggable="true" data-drag-handle />
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: "code highlighter",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "react-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["react-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
