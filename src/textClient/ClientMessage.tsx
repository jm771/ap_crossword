import React, { forwardRef } from "react";
import MessagePart from "./MessagePart";
import { APMessage } from "./textClientManager";
import { RowComponentProps } from "react-window";

const ClientMessage = forwardRef(
  (
    { index, style, messages }: RowComponentProps<{ messages: APMessage[] }>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const message = messages[index];
    return (
      <div
        ref={ref}
        style={{
          ...style,
          padding: "0.25em",
          backgroundColor:
            index % 2 === 1 ? "rgba(128, 128, 128, 0.2)" : "rgba(0, 0, 0, 0)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {message.parts.map((part, index) => (
          // Parts will never change order, we can keep the index as the key
          <MessagePart part={part} key={index} />
        ))}
      </div>
    );
  },
);

ClientMessage.displayName = "ClientMessage";
export default ClientMessage;
