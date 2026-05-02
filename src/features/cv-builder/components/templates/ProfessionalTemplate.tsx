import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

const FONT_SIZE_MAP = { small: 9, medium: 11, large: 13 };
const LINE_SPACING_MAP = { compact: 1.1, normal: 1.25, relaxed: 1.5 };
const MARGIN_MAP = { narrow: 25, normal: 40, wide: 55 };

const baseStyles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Times-Roman', fontSize: 11, color: '#000' },
    header: { marginBottom: 7, textAlign: 'center' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#000' },
    title: { fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 5, fontSize: 10 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, marginTop: 2 },
    section: { marginBottom: 8 },
    summaryText: { lineHeight: 1.3, textAlign: 'justify' },
    itemBlock: { marginBottom: 2 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    itemTitle: { fontWeight: 'bold', color: '#000' },
    itemDate: { fontStyle: 'italic' },
    itemSubtitle: { fontStyle: 'italic', marginBottom: 2 },
    bulletPoint: { flexDirection: 'row', marginBottom: 0, paddingLeft: 10 },
    bulletText: { flex: 1, lineHeight: 1.4, textAlign: 'justify' },
    bulletIcon: { width: 10, marginRight: 2 },
    skillsContainer: { flexDirection: 'column', gap: 6 },
    skillItem: { fontSize: 11, marginBottom: 2, fontWeight: 'bold' },
    skillKeywords: { color: '#000', fontWeight: 'normal', fontSize: 10 },
    skillLevel: { color: '#888', fontSize: 10 },
    website: { textDecoration: 'underline' },
});

export const ProfessionalTemplate = ({ data }: { data: ResumeData }) => {
    const { basics, work, education, skills, projects, volunteer, languages, certifications, settings } = data;
    const accentColor = settings?.color || '#000000';
    const fontSize = settings?.fontSize || 'medium';
    const lineSpacing = settings?.lineSpacing || 'normal';
    const margin = settings?.margin || 'normal';

    const baseFontSize = FONT_SIZE_MAP[fontSize];
    const baseLineSpacing = LINE_SPACING_MAP[lineSpacing];
    const pageMargin = MARGIN_MAP[margin];

    const styles = StyleSheet.create({
        page: { ...baseStyles.page, padding: pageMargin, fontSize: baseFontSize, lineHeight: baseLineSpacing },
        header: baseStyles.header,
        name: { ...baseStyles.name, color: accentColor, fontSize: baseFontSize + 13 },
        title: { ...baseStyles.title, fontSize: baseFontSize + 3 },
        contactRow: { ...baseStyles.contactRow, fontSize: baseFontSize - 1 },
        sectionTitle: { ...baseStyles.sectionTitle, fontSize: baseFontSize + 1 },
        section: baseStyles.section,
        summaryText: { ...baseStyles.summaryText, lineHeight: baseLineSpacing },
        itemBlock: { ...baseStyles.itemBlock, marginBottom: baseFontSize },
        itemHeader: { ...baseStyles.itemHeader, marginBottom: baseFontSize / 4 },
        itemTitle: { ...baseStyles.itemTitle, fontSize: baseFontSize },
        itemDate: { ...baseStyles.itemDate, fontSize: baseFontSize - 1 },
        itemSubtitle: { ...baseStyles.itemSubtitle, marginBottom: baseFontSize / 4 },
        bulletPoint: { ...baseStyles.bulletPoint, marginBottom: baseFontSize / 4 },
        bulletText: { ...baseStyles.bulletText, lineHeight: baseLineSpacing, fontSize: baseFontSize },
        bulletIcon: baseStyles.bulletIcon,
        skillsContainer: baseStyles.skillsContainer,
        skillItem: { ...baseStyles.skillItem, fontSize: baseFontSize },
        skillKeywords: { ...baseStyles.skillKeywords, fontSize: baseFontSize - 1 },
        skillLevel: { ...baseStyles.skillLevel, fontSize: baseFontSize - 1 },
        website: baseStyles.website,
    });

    return (
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                {basics.name && <Text style={styles.name}>{basics.name}</Text>}
                {basics.label && <Text style={styles.title}>{basics.label}</Text>}
                <View style={styles.contactRow}>
                    {basics.email && <Text>{basics.email}</Text>}
                    {basics.phone && <Text>|  {basics.phone}</Text>}
                    {basics.location && <Text>|  {typeof basics.location === 'string' ? basics.location : ''}</Text>}
                    {basics.url && <Text>|  <Text style={styles.website}>{basics.url}</Text></Text>}
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
                                        <Text style={styles.bulletIcon}>-</Text>
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
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
                    {work.map((item, index) => {
                        const highlightsArray = typeof item.highlights === 'string' 
                            ? item.highlights.split('\n').filter((h) => h.trim())
                            : item.highlights;
                        return (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{item.position}, {item.company}</Text>
                                    <Text style={styles.itemDate}>
                                        {item.startDate} {item.endDate ? `- ${item.endDate}` : '- Present'}
                                    </Text>
                                </View>
                                {item.summary && <Text style={{ marginBottom: 4 }}>{item.summary}</Text>}
                                {highlightsArray && highlightsArray.length > 0 && highlightsArray.map((highlight, hIdx) => (
                                    <View key={hIdx} style={styles.bulletPoint}>
                                        <Text style={styles.bulletIcon}>-</Text>
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
                    <Text style={styles.sectionTitle}>Volunteer Experience</Text>
                    {volunteer.map((item, index) => {
                        const highlightsArray = typeof item.highlights === 'string' 
                            ? item.highlights.split('\n').filter((h) => h.trim())
                            : item.highlights;
                        return (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{item.position}, {item.organization}</Text>
                                    <Text style={styles.itemDate}>
                                        {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                                    </Text>
                                </View>
                                {highlightsArray && highlightsArray.length > 0 && highlightsArray.map((highlight, hIdx) => (
                                    <View key={hIdx} style={styles.bulletPoint}>
                                        <Text style={styles.bulletIcon}>-</Text>
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
                            <Text>
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
                            <Text key={index} style={styles.skillItem}>
                                {skill.name}
                                {skill.keywords && <Text style={styles.skillKeywords}>: {skill.keywords}</Text>}
                                {skill.level && <Text style={styles.skillLevel}> ({skill.level})</Text>}
                            </Text>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    );
};
