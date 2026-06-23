import React from "react";
import { MessageNode } from "archipelago.js";
import { EchoMessageNode } from "./textClientManager";
import { colors } from "./colors";

const MessagePart = ({ part }: { part: MessageNode | EchoMessageNode }) => {
    let textColor: string | null = null;
    let backgroundColor: string | undefined = undefined;
    let additionalInfo: string | null = null;
    let fontWeight: string | undefined = undefined;

    if (part.type === "item") {
        const itemClasses = [];
        if (part.item.trap) {
            textColor = "#ff4444";
            itemClasses.push("Trap");
        }
        if (part.item.useful) {
            textColor = "#4444ff";
            itemClasses.push("Useful");
        }
        if (part.item.progression) {
            textColor = "#ff00ff";
            fontWeight = "bold";
            itemClasses.push("Progression");
        }
        if (itemClasses.length === 0) {
            itemClasses.push("Normal");
        }
        additionalInfo = `Game: ${part.item.game}, Class: ${itemClasses.join(", ")}`;
    } else if (part.type === "location") {
        textColor = "#00aa00";
    } else if (part.type === "player") {
        textColor = "#00aaaa";
        fontWeight = "bold";
        additionalInfo = `Game: ${part.player.game}`;
    } else if (part.type === "entrance") {
        textColor = "#aa5500";
    } else if (part.type === "color" || part.type === "echo") {
        if (part.color && part.color.endsWith("_bg")) {
            const colorKey = part.color.substring(0, part.color.length - 3);
            backgroundColor = colors[colorKey] || undefined;
        } else if (part.color) {
            textColor = colors[part.color] || null;
        }
    }

    const styles: React.CSSProperties = {
        whiteSpace: "pre-wrap",
    };
    if (textColor) {
        styles.color = textColor;
    }
    if (backgroundColor) {
        styles.backgroundColor = backgroundColor;
    }
    if (fontWeight) {
        styles.fontWeight = fontWeight;
    }

    return (
        <span
            style={styles}
            title={additionalInfo || undefined}
        >
            {part.text}
        </span>
    );
};

export default MessagePart;
