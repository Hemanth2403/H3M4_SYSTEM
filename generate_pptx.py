from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

def create_presentation():
    prs = Presentation()

    # --- Slide 1: Title Slide ---
    slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(slide_layout)
    title = slide.shapes.title
    subtitle = slide.placeholders[1]

    title.text = "H3M4 Ecosystem"
    subtitle.text = (
        "The Collaborative Cybersecurity Framework for FinTech\n\n"
        "Pitch Deck\n"
        "M Hemanth Naik"
    )

    # --- Slide 2: The Problem ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "The Problem"
    tf = slide.placeholders[1].text_frame
    def add_bullet(text_frame, text):
        p = text_frame.add_paragraph()
        p.text = text
        p.alignment = PP_ALIGN.LEFT
        return p

    add_bullet(tf, "• Fragmented Defense: Financial institutions fight cyber threats in extreme isolation.")
    add_bullet(tf, "• Asymmetric Warfare: Attackers share exploits globally, while defenders hide breaches due to reputation risk.")
    add_bullet(tf, "• Slow Forensics: Converting an attack log into actionable legal evidence takes months.")
    add_bullet(tf, "• High Cost of Breaches: Continual ransomware and PII leaks cause billion-dollar losses annually.")

    # --- Slide 3: The Solution (H3M4) ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "Our Solution: H3M4 Ecosystem"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "A secure, federated hub bridging Enterprises, Independent Researchers, and Law Enforcement.")
    add_bullet(tf, "• Herd Immunity: One bank's localized breach detection instantly protects the entire network.")
    add_bullet(tf, "• Zero-Knowledge Intel: Enterprises can anonymize and share threat signatures safely.")
    add_bullet(tf, "• Actionable Forensics: Automated tools to wrap technical IOCs into court-ready FIRs.")

    # --- Slide 4: How It Works ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "How It Works"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "1. Sense (Enterprises): SIEM integrations detect anomalies & share IOCs.")
    add_bullet(tf, "2. Discover (Researchers): Bounty hunters provide pro-active dark web intelligence.")
    add_bullet(tf, "3. Validate (System): Automated 'Breach Bots' and reputation scoring vet the data.")
    add_bullet(tf, "4. Enforce (Police): Validated threats are packaged for immediate legal takedown.")

    # --- Slide 5: Key Capabilities ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "Key Capabilities"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "• Global Threat Graph: Real-time visual tracking of threat actors across the financial sector.")
    add_bullet(tf, "• Neural Query Console: AI-driven conversational intelligence for threat hunting.")
    add_bullet(tf, "• Automated Triage & Scoring: Instantly separating critical vulnerabilities from noise.")
    add_bullet(tf, "• Cryptographic Chain-of-Custody: Ensuring all cyber evidence remains legally admissible.")

    # --- Slide 6: Market Opportunity ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "Market Opportunity"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "• Target Market: Global FinTech, Banking, and Government Law Enforcement.")
    add_bullet(tf, "• The Gap: Current Threat Intel Platforms (TIPs) are B2B only and exclude law enforcement & public researchers.")
    add_bullet(tf, "• Urgency: 53% YoY surge in specialized FinTech cyberattacks and new regulatory pressures (e.g., DORA compliance).")

    # --- Slide 7: Business Model ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "Business Model"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "• B2B SaaS for Enterprises: Tiered subscriptions based on log ingestion limits and early-warning alerts.")
    add_bullet(tf, "• Government Defense Contracts: Delivering the overarching intelligence feed to National Cyber Agencies.")
    add_bullet(tf, "• Bug Bounty Commission: Percentage fee on payouts routed to Independent Researchers.")

    # --- Slide 8: Competitive Advantage ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "Competitive Advantage"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "• Traditional SIEMs (Splunk, Sentinel): Reactive & Isolated.")
    add_bullet(tf, "• Threat Feeds (Crowdstrike, Mandiant): Expensive & Proprietary.")
    add_bullet(tf, "• Bug Bounties (HackerOne): Don't interface with active Enterprise defense networks.")
    add_bullet(tf, "• H3M4 combines all three: Proactive intelligence + Reactive defense + Direct Legal action.")

    # --- Slide 9: Traction & Milestones ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "Traction & Milestones"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "• Q1: Core architecture complete (Multi-tenant, Role Based Access).")
    add_bullet(tf, "• Q2: Pilot deployment with simulated Enterprise nodes and Police Dashboard.")
    add_bullet(tf, "• Q3 Goal: Integrate live Wazuh/SIEM feeds & onboard beta FinTech partners.")
    add_bullet(tf, "• Q4 Goal: Launch production 'Breach Bot' pipeline for active legal cases.")

    # --- Slide 10: Architecture Overview ---
    slide = prs.slides.add_slide(prs.slide_layouts[6]) # Blank layout
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(9), Inches(1))
    title_box.text_frame.text = "Collaborative Flow"
    
    def add_node(left, top, text, color):
        shape = slide.shapes.add_shape(6, Inches(left), Inches(top), Inches(2), Inches(0.8))
        shape.fill.solid()
        shape.fill.fore_color.rgb = color
        shape.text = text
        shape.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
        return shape

    res = add_node(2, 2, "Researchers\n(Offense Intel)", RGBColor(0, 102, 204))
    ent = add_node(2, 4, "Enterprises\n(Defense Logs)", RGBColor(0, 153, 0))
    hub = add_node(5, 3, "H3M4 Core\n(Validation)", RGBColor(128, 0, 128))
    pol = add_node(8, 3, "Police\n(Enforcement)", RGBColor(204, 0, 0))

    prs.slides[9].shapes.add_connector(2, res.left + Inches(2), res.top + Inches(0.4), hub.left, hub.top + Inches(0.4))
    prs.slides[9].shapes.add_connector(2, ent.left + Inches(2), ent.top + Inches(0.4), hub.left, hub.top + Inches(0.4))
    prs.slides[9].shapes.add_connector(2, hub.left + Inches(2), hub.top + Inches(0.4), pol.left, pol.top + Inches(0.4))

    # --- Slide 11: Call to Action / The Ask ---
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    slide.shapes.title.text = "The Ask & Next Steps"
    tf = slide.placeholders[1].text_frame
    add_bullet(tf, "• Looking for Strategic Partnerships with Forward-thinking Financial Institutions.")
    add_bullet(tf, "• Seeking Pilot engagements with Regional Cybercrime Cells.")
    add_bullet(tf, "• Target: Seed Funding ($X Million) to scale infrastructure and go-to-market efforts.")

    # --- Slide 12: Contact ---
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    slide.shapes.title.text = "Join the Ecosystem"
    slide.placeholders[1].text = "Contact: M Hemanth Naik\nEmail: [Insert Email]\nLet's Build the Future of Federated FinTech Defense."

    prs.save("H3M4_Pitch_Deck.pptx")
    print("Pitch Deck generated successfully as H3M4_Pitch_Deck.pptx!")

if __name__ == "__main__":
    create_presentation()

