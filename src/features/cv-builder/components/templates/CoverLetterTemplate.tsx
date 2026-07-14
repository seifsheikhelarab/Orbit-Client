import { Page, Text, View, StyleSheet, Document } from "@react-pdf/renderer";
import type { CoverLetterContent } from "../../types";

const styles = StyleSheet.create({
    page: {
        padding: 48,
        fontFamily: "Helvetica",
        fontSize: 11,
        lineHeight: 1.6,
        color: "#1a1a2e"
    },
    header: {
        marginBottom: 32
    },
    date: {
        fontSize: 10,
        color: "#6b7280",
        marginBottom: 24
    },
    recipient: {
        marginBottom: 24
    },
    recipientName: {
        fontFamily: "Helvetica-Bold",
        fontWeight: 700,
        marginBottom: 4
    },
    recipientTitle: {
        marginBottom: 2
    },
    company: {
        marginBottom: 2
    },
    address: {
        fontSize: 10,
        color: "#6b7280",
        marginBottom: 4
    },
    body: {
        marginBottom: 24
    },
    paragraph: {
        marginBottom: 12
    },
    closing: {
        marginTop: 24
    },
    signature: {
        marginTop: 12
    }
});

interface CoverLetterTemplateProps {
    content: CoverLetterContent;
    settings?: { color?: string };
}

export function CoverLetterTemplate({ content }: CoverLetterTemplateProps) {
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const recipientGreeting = content.recipientName.trim().split(" ")[0] || "Hiring Manager";
    const bodyParagraphs = content.body.split("\n").map((line) => line.trim()).filter(Boolean);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.date}>{today}</Text>
                </View>

                <View style={styles.recipient}>
                    <Text style={styles.recipientName}>{content.recipientName}</Text>
                    <Text style={styles.recipientTitle}>{content.recipientTitle}</Text>
                    <Text style={styles.company}>{content.company}</Text>
                    {content.address && <Text style={styles.address}>{content.address}</Text>}
                    {content.email && <Text style={styles.address}>{content.email}</Text>}
                </View>

                <View style={styles.body}>
                    <Text style={styles.paragraph}>Dear {recipientGreeting},</Text>
                    <Text style={styles.paragraph}>{content.opening}</Text>
                    {bodyParagraphs.map((paragraph, index) => (
                        <Text key={index} style={styles.paragraph}>{paragraph}</Text>
                    ))}
                    <Text style={styles.paragraph}>{content.closing}</Text>
                </View>

                <View style={styles.closing}>
                    <Text style={styles.signature}>{content.signature}</Text>
                    {content.senderName && <Text style={styles.signature}>{content.senderName}</Text>}
                </View>
            </Page>
        </Document>
    );
}
