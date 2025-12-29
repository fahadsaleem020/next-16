import { mergeAttributes, Node } from "@tiptap/core";

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: {
        src: string;
        controls?: boolean;
        autoplay?: boolean;
        loop?: boolean;
        poster?: string;
        width?: number | string;
        height?: number | string;
      }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        controls: true,
        autoplay: false,
        muted: false,
        playsInline: false,
        preload: "metadata",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      autoplay: {
        default: false,
      },
      loop: {
        default: false,
      },
      poster: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    delete attrs.muted;
    delete attrs.autoplay;
    delete attrs.playsInline;

    return ["video", attrs];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
