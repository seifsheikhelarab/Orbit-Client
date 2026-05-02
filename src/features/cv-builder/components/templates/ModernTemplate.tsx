import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

const FONT_SIZE_MAP = { small: 9, medium: 11, large: 13 };
const LINE_SPACING_MAP = { compact: 1.1, normal: 1.25, relaxed: 1.5 };
const MARGIN_MAP = { narrow: 20, normal: 30, wide: 40 };

const baseStyles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 11, color: '#333' },
    header: { marginBottom: 14, borderBottomWidth: 2, borderBottomColor: '#1e3a8a', paddingBottom: 8 },
    name: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#1e3a8a' },
    title: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: 'bold' },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, fontSize: 10, color: '#555' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6, color: '#1e3a8a', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 },
    section: { marginBottom: 8 },
    summaryText: { lineHeight: 1.3 },
    itemBlock: { marginBottom: 8 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    itemTitle: { fontWeight: 'bold', color: '#000' },
    itemDate: { color: '#1e3a8a', fontSize: 10 },
    itemSubtitle: { fontStyle: 'italic', marginBottom: 4 },
    bulletPoint: { flexDirection: 'row', marginBottom: 2 },
    bulletText: { flex: 1, lineHeight: 1.4 },
    bulletIcon: { width: 10, marginRight: 2, color: '#1e3a8a' },
    skillsContainer: { flexDirection: 'column', gap: 8 },
    skillItem: { marginBottom: 4, fontWeight: 'bold' },
    skillKeywords: { color: '#000', fontWeight: 'normal', fontSize: 9 },
    skillLevel: { color: '#888', fontSize: 9 },
    website: { fontSize: 10, color: '#1e3a8a', textDecoration: 'underline' },
});

export const ModernTemplate = ({ data }: { data: ResumeData }) => {
    const { basics, work, education, skills, projects, volunteer, languages, certifications, settings } = data;
    const accentColor = settings?.color || '#1e3a8a';
    const fontSize = settings?.fontSize || 'medium';
    const lineSpacing = settings?.lineSpacing || 'normal';
    const margin = settings?.margin || 'normal';

    const baseFontSize = FONT_SIZE_MAP[fontSize];
    const baseLineSpacing = LINE_SPACING_MAP[lineSpacing];
    const pageMargin = MARGIN_MAP[margin];

    const styles = StyleSheet.create({
        page: { ...baseStyles.page, padding: pageMargin, fontSize: baseFontSize, lineHeight: baseLineSpacing },
        header: { ...baseStyles.header, borderBottomColor: accentColor },
        name: { ...baseStyles.name, color: accentColor, fontSize: baseFontSize + 15 },
        title: { ...baseStyles.title, fontSize: baseFontSize + 3, marginBottom: baseFontSize / 2 },
        contactRow: { ...baseStyles.contactRow, fontSize: baseFontSize - 1 },
        sectionTitle: { ...baseStyles.sectionTitle, color: accentColor, fontSize: baseFontSize + 3 },
        section: { marginBottom: baseFontSize + 2 },
        summaryText: { ...baseStyles.summaryText, lineHeight: baseLineSpacing },
        itemBlock: { ...baseStyles.itemBlock, marginBottom: baseFontSize },
        itemHeader: { ...baseStyles.itemHeader, marginBottom: baseFontSize / 2 },
        itemTitle: { ...baseStyles.itemTitle, fontSize: baseFontSize + 1 },
        itemDate: { ...baseStyles.itemDate, color: accentColor, fontSize: baseFontSize - 1 },
        itemSubtitle: { ...baseStyles.itemSubtitle, marginBottom: baseFontSize / 2 },
        bulletPoint: { ...baseStyles.bulletPoint, marginBottom: baseFontSize / 3 },
        bulletText: { ...baseStyles.bulletText, lineHeight: baseLineSpacing, fontSize: baseFontSize },
        bulletIcon: { ...baseStyles.bulletIcon, color: accentColor },
        skillsContainer: baseStyles.skillsContainer,
        skillItem: { ...baseStyles.skillItem, fontSize: baseFontSize },
        skillKeywords: { ...baseStyles.skillKeywords, fontSize: baseFontSize - 1 },
        skillLevel: { ...baseStyles.skillLevel, fontSize: baseFontSize - 1 },
        website: { ...baseStyles.website, color: accentColor, fontSize: baseFontSize - 1 },
    });

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                {basics.name && <Text style={styles.name}>{basics.name}</Text>}
                {basics.label && <Text style={styles.title}>{basics.label}</Text>}
                <View style={styles.contactRow}>
                    {basics.email && <Text>{basics.email}</Text>}
                    {basics.phone && <Text>{basics.phone}</Text>}
                    {basics.location && <Text>{typeof basics.location === 'string' ? basics.location : ''}</Text>}
                    {basics.url && <Text style={styles.website}>{basics.url}</Text>}
                </View>
            </View>

            {basics.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <Text style={styles.summaryText}>{basics.summary}</Text>
                </View>
            )}

            {projects && projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {projects.map((item, index) => {
                        const highlightsArray = typeof item.highlights === 'string' 
                            ? item.highlights.split('\n').filter((h) => h.trim())
                            : item.highlights;
                        return (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{item.name}</Text>
                                    {item.startDate && (
                                        <Text style={styles.itemDate}>
                                            {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                                        </Text>
                                    )}
                                </View>
                                {item.description && <Text style={{ marginBottom: 4 }}>{item.description}</Text>}
                                {item.url && <Text style={styles.website}>{item.url}</Text>}
                                {highlightsArray && highlightsArray.length > 0 && highlightsArray.map((highlight, hIdx) => (
                                    <View key={hIdx} style={styles.bulletPoint}>
                                        <Text style={styles.bulletIcon}>•</Text>
                                        <Text style={styles.bulletText}>{String(highlight).trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {work && work.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {work.map((item, index) => {
                        const highlightsArray = typeof item.highlights === 'string' 
                            ? item.highlights.split('\n').filter((h) => h.trim())
                            : item.highlights;
                        return (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{item.position}</Text>
                                    <Text style={styles.itemDate}>
                                        {item.startDate} {item.endDate ? `- ${item.endDate}` : '- Present'}
                                    </Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{item.company}</Text>
                                {item.summary && <Text style={{ marginBottom: 4 }}>{item.summary}</Text>}
                                {highlightsArray && highlightsArray.length > 0 && highlightsArray.map((highlight, hIdx) => (
                                    <View key={hIdx} style={styles.bulletPoint}>
                                        <Text style={styles.bulletIcon}>•</Text>
                                        <Text style={styles.bulletText}>{String(highlight).trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {volunteer && volunteer.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Volunteer</Text>
                    {volunteer.map((item, index) => {
                        const highlightsArray = typeof item.highlights === 'string' 
                            ? item.highlights.split('\n').filter((h) => h.trim())
                            : item.highlights;
                        return (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{item.position}</Text>
                                    <Text style={styles.itemDate}>
                                        {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                                    </Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{item.organization}</Text>
                                {highlightsArray && highlightsArray.length > 0 && highlightsArray.map((highlight, hIdx) => (
                                    <View key={hIdx} style={styles.bulletPoint}>
                                        <Text style={styles.bulletIcon}>•</Text>
                                        <Text style={styles.bulletText}>{String(highlight).trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            )}

            {education && education.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {education.map((item, index) => (
                        <View key={index} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{item.institution}</Text>
                                <Text style={styles.itemDate}>
                                    {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                                </Text>
                            </View>
                            <Text style={styles.itemSubtitle}>
                                {item.studyType} {item.area && `in ${item.area}`}
                                {item.score && ` - ${item.score}`}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {languages && languages.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Languages</Text>
                    {languages.map((item, index) => (
                        <View key={index} style={{ ...styles.itemBlock, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemSubtitle}>{item.fluency}</Text>
                        </View>
                    ))}
                </View>
            )}

            {certifications && certifications.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {certifications.map((item, index) => (
                        <View key={index} style={styles.itemBlock}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{item.name}</Text>
                                <Text style={styles.itemDate}>
                                    {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                                </Text>
                            </View>
                            <Text style={styles.itemSubtitle}>{item.issuer}</Text>
                            {item.url && <Text style={styles.website}>{item.url}</Text>}
                        </View>
                    ))}
                </View>
            )}

            {skills && skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillsContainer}>
                        {skills.map((skill, index) => (
                            <View key={index} style={styles.skillItem}>
                                <Text>
                                    {skill.name}
                                    {skill.keywords && <Text style={styles.skillKeywords}>: {skill.keywords}</Text>}
                                    {skill.level && <Text style={styles.skillLevel}> ({skill.level})</Text>}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    );
};
