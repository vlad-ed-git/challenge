import { PolicySelections } from "@/components/game/types";
import { reflectionQuestionKeys, ReflectionReportData } from "../../../../lib/form_models/reflection_schema";
import { Resend } from 'resend';

function formatSelectionsHtml(selections: Required<PolicySelections> | null): string {
    if (!selections) return "<p><em>No selections recorded for this phase.</em></p>";
    let listHtml = '<ul style="list-style-type: none; padding-left: 0;">';
    for (const [area, option] of Object.entries(selections)) {
        listHtml += `<li style="margin-bottom: 5px;"><strong>${area.charAt(0).toUpperCase() + area.slice(1)}:</strong> ${option}</li>`;
    }
    listHtml += '</ul>';
    return listHtml;
}

const questionTextMap: Record<typeof reflectionQuestionKeys[number], string> = {
    'reflection_emotions': "What emotions came up for you during the decision-making process—discomfort, frustration, detachment, guilt? What do those feelings reveal about your position in relation to refugee education?",
    'reflection_familiarity': "Did anything about your role in the game feel familiar—either from your personal or professional life? If so, how?",
    'reflection_assumptions': "What assumptions about refugees, policy, or education were challenged or reinforced during the game?",
    'reflection_dynamics': "How did the group dynamics impact your ability to advocate for certain policies? Were there moments when you chose silence or compromise? Why?",
    'reflection_understanding_shift': "Has your understanding of refugee education shifted from seeing it as a service “for them” to a system embedded in broader struggles over power, identity, and justice? If so, how?",
    'reflection_interests_served': "Whose interests did your decisions ultimately serve—refugees, citizens, or the state? Why?",
    'reflection_power_absent': "What power did you assume you had as a policymaker—and who did you imagine was absent or voiceless in that process?",
    'reflection_compromises': "What compromises did you make for the sake of consensus, and who or what got erased in the process?",
    'reflection_game_limits': "How did the structure of the game (budget, options, scenario) shape or limit your imagination of justice?",
    'reflection_transformation': "If refugee education wasn't about inclusion into existing systems—but about transforming those systems—what would that look like, and did your decisions move toward or away from that?",
};

// Main formatting function
function formatReportAsHtml(report: ReflectionReportData): string {
    // Basic inline styles for email client compatibility
    const styles = {
        body: `font-family: sans-serif; line-height: 1.6; color: #333;`,
        h1: `color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px;`, // Example primary color
        h2: `color: #0056b3; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 3px;`,
        h3: `color: #333; margin-top: 15px; margin-bottom: 5px; font-size: 1.1em;`,
        ul: `list-style-type: none; padding-left: 0;`,
        li: `margin-bottom: 5px;`,
        p: `margin-top: 0; margin-bottom: 10px;`,
        strong: `font-weight: bold;`,
        code: `font-family: monospace; background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px;`,
        table: `width: 100%; border-collapse: collapse; margin-top: 10px;`,
        th: `border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;`,
        td: `border: 1px solid #ddd; padding: 8px; text-align: left;`,
    };

    // Safely format the date
    const submittedDate = Date.now().toLocaleString();

    // Format Agent Happiness
    const agentHappinessHtml = `
        <table style="${styles.table}">
            <thead>
                <tr>
                    <th style="${styles.th}">Agent</th>
                    <th style="${styles.th}">Happiness Score (0.0 - 1.0)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td style="${styles.td}">State</td><td style="${styles.td}">${report.agentHappiness.state.toFixed(2)}</td></tr>
                <tr><td style="${styles.td}">Citizen</td><td style="${styles.td}">${report.agentHappiness.citizen.toFixed(2)}</td></tr>
                <tr><td style="${styles.td}">Human Rights</td><td style="${styles.td}">${report.agentHappiness.humanRights.toFixed(2)}</td></tr>
            </tbody>
        </table>`;

    // Format Reflection Answers
    let reflectionHtml = '';
    for (const key of reflectionQuestionKeys) {
        const questionText = questionTextMap[key] || key.replace('reflection_', '').replace(/_/g, ' '); // Fallback formatting
        const answer = report.reflectionAnswers[key];
        reflectionHtml += `
            <div style="margin-bottom: 15px;">
                <h3 style="${styles.h3}">${questionText}</h3>
                <p style="${styles.p}">${answer || '<em>No answer provided.</em>'}</p>
            </div>
        `;
    }
    // Add optional feedback if present
    if (report.optional_feedback) {
        reflectionHtml += `
            <div style="margin-bottom: 15px;">
                <h3 style="${styles.h3}">Optional Feedback</h3>
                <p style="${styles.p}">${report.optional_feedback}</p>
            </div>
        `;
    }


    // Assemble the full HTML body
    const htmlBody = `
        <div style="${styles.body}">
            <h1 style="${styles.h1}">CHALLENGE Game Reflection Report</h1>
            <p style="${styles.p}"><strong style="${styles.strong}">User ID:</strong> <code style="${styles.code}">${report.userId}</code></p>
            <p style="${styles.p}"><strong style="${styles.strong}">Submitted At:</strong> ${submittedDate} via <a href="https://lou-challenge.vercel.app/">Website Link</a></p>

            <h2 style="${styles.h2}">User Profile Snapshot</h2>
            <ul style="${styles.ul}">
                <li style="${styles.li}"><strong style="${styles.strong}">Age:</strong> ${report.userProfileSnapshot.age}</li>
                <li style="${styles.li}"><strong style="${styles.strong}">Nationality:</strong> ${report.userProfileSnapshot.nationality}</li>
                <li style="${styles.li}"><strong style="${styles.strong}">Occupation:</strong> ${report.userProfileSnapshot.occupation}</li>
                <li style="${styles.li}"><strong style="${styles.strong}">Education:</strong> ${report.userProfileSnapshot.educationalLevel}</li>
                <li style="${styles.li}"><strong style="${styles.strong}">Location:</strong> ${report.userProfileSnapshot.currentCity}, ${report.userProfileSnapshot.currentCountry}</li>
                <li style="${styles.li}"><strong style="${styles.strong}">Displacement Experience:</strong> ${report.userProfileSnapshot.displacementStatus.hasExperience ? 'Yes' : 'No'}</li>
                ${report.userProfileSnapshot.displacementStatus.narrative ? `<li style="${styles.li}"><strong style="${styles.strong}">Displacement Narrative:</strong> ${report.userProfileSnapshot.displacementStatus.narrative}</li>` : ''}
            </ul>

            <h2 style="${styles.h2}">Phase I Selections</h2>
            ${formatSelectionsHtml(report.phaseOneSelections)}

            <h2 style="${styles.h2}">Phase II Final Selections</h2>
            ${formatSelectionsHtml(report.phaseTwoSelections)}

            <h2 style="${styles.h2}">Final Agent Happiness</h2>
            ${agentHappinessHtml}

            <h2 style="${styles.h2}">Reflection Answers</h2>
            ${reflectionHtml}

        </div>
    `;

    return htmlBody;
}


// Function to send the email
export async function sendReportEmail(report: ReflectionReportData,): Promise<void> {
    try {
        const htmlBody = formatReportAsHtml(report);
        const receipientEmails = ["vkowelo@asu.edu",
            "aturan@asu.edu",
            "JANEL.WHITE@asu.edu"
        ]



        const resend = new Resend(
            process.env.RESEND_API_KEY
        );

        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: receipientEmails,
            subject: 'CHALLENGE Game Reflection Report',
            html: htmlBody,
        });
    } catch (error) {
        console.error("Failed to send report email:", error);
        throw new Error("Failed to send report email");
    }
}

// the api route
export async function POST(request: Request) {
    try {
        const report: ReflectionReportData = await request.json();


        // Validate required fields
        if (!report.userId || !report.reflectionAnswers) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Send the email
        await sendReportEmail(report);

        return new Response(JSON.stringify({ message: "Report email sent successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

