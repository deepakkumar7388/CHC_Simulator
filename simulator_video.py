"""
============================================================
HOSPITAL SIMULATOR VIDEO — Chaudhary Health Care Center
============================================================
Manim-based animated video with Hindi voice narration.
Generates a full MP4 video with all 14 scenes.

Usage:
    manim -pql --disable_caching simulator_video.py HospitalSimulator
    
For HD:
    manim -pqh --disable_caching simulator_video.py HospitalSimulator
============================================================
"""

from manim import *
import os
import subprocess
import json

# ============================================================
# CONFIG
# ============================================================
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
AUDIO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

# Colors — Light Theme
BG_WHITE = "#F8FAFC"
BG_LIGHT = "#EEF2FF"
BG_GREEN_LIGHT = "#ECFDF5"
BG_RED_LIGHT = "#FEF2F2"
BG_AMBER_LIGHT = "#FFFBEB"
BG_PURPLE_LIGHT = "#F5F3FF"

PRIMARY = "#4F46E5"
PRIMARY_DARK = "#3730A3"
SUCCESS = "#10B981"
SUCCESS_DARK = "#059669"
WARNING = "#F59E0B"
DANGER = "#EF4444"
TEXT_DARK = "#0F172A"
TEXT_MUTED = "#64748B"
BORDER_COLOR = "#E2E8F0"

# ============================================================
# VOICE GENERATION (gTTS)
# ============================================================
def generate_voice(text, filename):
    """Generate Hindi TTS audio file using gTTS."""
    filepath = os.path.join(AUDIO_DIR, filename)
    if os.path.exists(filepath):
        return filepath
    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang='hi', slow=False)
        tts.save(filepath)
        print(f"✅ Generated: {filename}")
    except Exception as e:
        print(f"⚠️ Voice generation failed for {filename}: {e}")
        # Create a silent audio file as fallback
        try:
            subprocess.run([
                'ffmpeg', '-y', '-f', 'lavfi', '-i',
                'anullsrc=r=44100:cl=mono', '-t', '3',
                '-q:a', '9', '-acodec', 'libmp3lame', filepath
            ], capture_output=True, timeout=10)
        except Exception:
            pass
    return filepath


# Pre-generate all voice files
SCRIPTS = {
    "scene1": "चलो एक normal hospital का एक दिन imagine करते हैं। सुबह hospital खुलता है, patients आना शुरू होते हैं, reception पर registration चल रहा है, doctors अपने patients देख रहे हैं। बाहर से देखने पर सब कुछ बिल्कुल normal लगता है। लेकिन असली problem अंदर से शुरू होती है।",
    
    "scene2": "मान लीजिए आज एक patient hospital आता है। Reception पर उसकी सारी information लिखी जाती है, नाम, mobile number, problem, doctor, सब कुछ। अब patient admitted हो गया। कुछ information reception के पास है, कुछ doctor के पास, कुछ nurse के पास, और billing की information एक अलग जगह। Patient एक है, लेकिन उसकी information कई जगह बंटी हुई है।",
    
    "scene3": "अब सोचिए, doctor को इस patient की पुरानी history देखनी है। File कहाँ है? किस register में है? पिछली बार कौन सा treatment दिया गया था? कोई allergy थी या नहीं? एक छोटी सी information ढूँढने में ही कितना time चला गया। और hospital में ये सिर्फ एक patient की बात नहीं है। हर patient के साथ यही कहानी repeat हो सकती है।",
    
    "scene4": "अब situation थोड़ी serious करते हैं। एक emergency patient hospital में आता है। सबसे पहला सवाल होता है, bed available है? लेकिन bed देखने के लिए staff को ward में जाना पड़ता है, check करना पड़ता है, फिर वापस आकर बताना पड़ता है। Emergency में ये सिर्फ delay नहीं है। कभी-कभी ये delay बहुत भारी पड़ सकता है।",
    
    "scene5": "अब patient admitted है। Nurse रोज़ उसके vitals note करती है, BP, temperature, SpO2। Medicines का भी record रखा जाता है। लेकिन अगर ये सब अलग-अलग papers पर लिखा जा रहा है, तो कल का record कहाँ मिलेगा? किसने entry की? कब की? और अगर कोई paper खो गया तो? Healthcare में छोटी सी information भी बहुत important होती है।",
    
    "scene6": "अब patient ठीक हो गया है और discharge का time आ गया। लेकिन discharge से पहले bill बनना है। Doctor charges, medicines, nursing, oxygen, tests, बाकी services। सब अलग-अलग जगह से निकालो, calculate करो, फिर bill बनाओ। Patient ready है जाने के लिए, लेकिन bill अभी ready नहीं है।",
    
    "scene7": "और एक और important सवाल है। Hospital में हर व्यक्ति को हर information देखने की जरूरत है क्या? Doctor को patient की medical information चाहिए। Nurse को treatment और medication की information चाहिए। Reception को admission की information चाहिए। Admin को पूरे hospital का overview चाहिए। तो फिर सबको सब कुछ क्यों दिखे? Information वही दिखनी चाहिए, जिसकी उस person को जरूरत है।",
    
    "scene8": "एक doctor ने patient के लिए कुछ instructions दिए, लेकिन nurse को time पर पता नहीं चला। Patient discharge हो गया, लेकिन बाकी department को information late मिली। Hospital में लोग अलग-अलग काम नहीं कर रहे होते, सब एक ही patient के लिए काम कर रहे होते हैं। फिर भी अगर information एक-दूसरे तक time पर नहीं पहुँचे, तो problem पैदा होना natural है।",
    
    "scene9": "और अब आते हैं hospital management पर। Management को जानना है, आज कितने patients हैं, कितने beds occupied हैं, कितना revenue आया, कितना pending है, कौन सा department कितना काम कर रहा है। लेकिन अगर information अलग-अलग registers में पड़ी है, तो management decision लेगा किसके basis पर?",
    
    "scene10": "तो problem सिर्फ paperwork की नहीं है। Problem ये है कि hospital में हर दिन बहुत सारी important information create होती है, लेकिन वो information सही समय पर, सही व्यक्ति तक, सही तरीके से नहीं पहुँच पाती। और healthcare में information की delay सिर्फ inconvenience नहीं होती। उसका असर patient, staff और पूरे hospital पर पड़ता है।",
    
    "scene11": "तो हमने सोचा, क्यों ना hospital के पूरे काम को एक जगह लाया जाए? एक ऐसी जगह जहाँ patient की information बिखरी हुई ना हो। जहाँ bed की स्थिति तुरंत पता चले। जहाँ doctor और nurse अपना clinical record आसानी से maintain कर सकें। जहाँ billing automatically organized हो। जहाँ हर व्यक्ति को सिर्फ वही information मिले जिसकी उसे जरूरत है। और जहाँ hospital management पूरे hospital को एक नजर में समझ सके।",
    
    "scene12": "अब उसी situation को एक बार फिर देखते हैं। Patient आया, reception पर information enter हुई, और patient की पूरी information एक जगह available हो गई। Available bed तुरंत दिखाई दिया। Doctor patient की history देख सकता है। Nurse vitals और medicines का record maintain कर सकती है। Billing में सारे charges एक ही जगह manage हो जाते हैं। और जैसे ही कोई important update होता है, जिसे जानकारी चाहिए, उसे information मिल जाती है।",
    
    "scene13": "लेकिन हमारे solution की सबसे important बात सिर्फ ये नहीं है कि सब कुछ digital है। सबसे important बात है, हर व्यक्ति का अपना काम, और उसी के हिसाब से उसका access। Admin को पूरे hospital का operational overview। Doctor को patient की clinical information। Nurse को patient care से जुड़ी information। और Receptionist को admission और patient registration की information। सिस्टम सबको जोड़ता है, लेकिन हर किसी को सब कुछ नहीं देता।",
    
    "scene14": "पहले hospital में लोग information ढूँढते थे, अब information उनके पास आती है। पहले एक patient की information कई जगह बंटी हुई थी, अब patient की पूरी journey एक जगह connected है। पहले हर department अपना-अपना काम कर रहा था, अब पूरा hospital एक system की तरह काम करता है। यही है हमारा Chaudhary Health Care Center Hospital Management System। एक ऐसा system जो सिर्फ hospital का काम digital नहीं करता, बल्कि पूरे hospital को एक साथ काम करने देता है।"
}


def generate_all_voices():
    """Generate all voice files."""
    for key, text in SCRIPTS.items():
        generate_voice(text, f"{key}.mp3")


# ============================================================
# HELPER FUNCTIONS
# ============================================================
def get_asset(name):
    return os.path.join(ASSETS, name)

def get_audio(name):
    return os.path.join(AUDIO_DIR, name)


# ============================================================
# MAIN SIMULATOR CLASS
# ============================================================
class HospitalSimulator(Scene):
    def construct(self):
        # Generate voices first
        generate_all_voices()
        
        # Run all scenes
        self.scene_1_normal_day()
        self.scene_2_patient_registration()
        self.scene_3_history_problem()
        self.scene_4_bed_availability()
        self.scene_5_clinical_records()
        self.scene_6_billing_problem()
        self.scene_7_privacy_problem()
        self.scene_8_communication_gap()
        self.scene_9_management_problem()
        self.scene_10_emotional_peak()
        self.scene_11_solution_reveal()
        self.scene_12_transformation()
        self.scene_13_role_based_access()
        self.scene_14_before_after()

    # ── Transition Helper ──
    def scene_transition(self, color=BG_WHITE):
        self.play(FadeOut(*self.mobjects), run_time=0.8)
        self.camera.background_color = color
    
    def add_voice(self, scene_key):
        audio_path = get_audio(f"{scene_key}.mp3")
        if os.path.exists(audio_path):
            self.add_sound(audio_path)

    # ── Title Card Helper ──
    def show_scene_badge(self, number, title, subtitle="", badge_color=PRIMARY):
        badge = VGroup(
            RoundedRectangle(
                corner_radius=0.15, width=2.2, height=0.45,
                fill_color=badge_color, fill_opacity=0.12,
                stroke_color=badge_color, stroke_width=1.5
            ),
            Text(f"SCENE {number}", font="Arial", font_size=18,
                 color=badge_color, weight=BOLD)
        ).arrange(ORIGIN).to_edge(UP, buff=0.5)
        
        title_text = Text(
            title, font="Arial", font_size=40, color=TEXT_DARK, weight=BOLD
        ).next_to(badge, DOWN, buff=0.4)
        
        subtitle_text = Text(
            subtitle, font="Arial", font_size=24, color=PRIMARY
        ).next_to(title_text, DOWN, buff=0.15) if subtitle else VGroup()
        
        self.play(
            FadeIn(badge, shift=DOWN * 0.3),
            FadeIn(title_text, shift=DOWN * 0.3),
            FadeIn(subtitle_text, shift=DOWN * 0.3) if subtitle else Wait(0),
            run_time=0.8
        )
        return VGroup(badge, title_text, subtitle_text)

    # ════════════════════════════════════════════
    # SCENE 1 — Normal Hospital Day
    # ════════════════════════════════════════════
    def scene_1_normal_day(self):
        self.camera.background_color = BG_WHITE
        self.add_voice("scene1")
        
        header = self.show_scene_badge(1, "एक Normal Hospital का", "एक Normal दिन")
        
        # Hospital building image
        hospital_img = ImageMobject(get_asset("hospital.jpg"))
        hospital_img.scale_to_fit_width(10)
        hospital_img.next_to(header, DOWN, buff=0.5)
        hospital_img.set_opacity(0)
        
        self.play(hospital_img.animate.set_opacity(1), run_time=1.5)
        
        # Characters walking in
        doctor_img = ImageMobject(get_asset("doctor.jpg")).scale_to_fit_height(2.5)
        nurse_img = ImageMobject(get_asset("nurse.jpg")).scale_to_fit_height(2.3)
        patient_img = ImageMobject(get_asset("patient.jpg")).scale_to_fit_height(2.4)
        
        doctor_img.move_to(LEFT * 6 + DOWN * 1)
        nurse_img.move_to(LEFT * 7 + DOWN * 1)
        patient_img.move_to(RIGHT * 7 + DOWN * 1)
        
        self.play(
            doctor_img.animate.move_to(LEFT * 3 + DOWN * 1),
            run_time=1.5
        )
        self.play(
            nurse_img.animate.move_to(LEFT * 0.5 + DOWN * 1),
            run_time=1.2
        )
        self.play(
            patient_img.animate.move_to(RIGHT * 2.5 + DOWN * 1),
            run_time=1.2
        )
        
        self.wait(2)
        
        # Warning text
        warning_bg = RoundedRectangle(
            corner_radius=0.2, width=10, height=1.2,
            fill_color="#FEF2F2", fill_opacity=1,
            stroke_color=DANGER, stroke_width=1.5
        ).to_edge(DOWN, buff=0.5)
        
        warning_text = Text(
            '"लेकिन असली problem… अंदर से शुरू होती है।"',
            font="Arial", font_size=26, color=DANGER, weight=BOLD
        ).move_to(warning_bg.get_center())
        
        self.play(
            FadeIn(warning_bg, shift=UP * 0.3),
            FadeIn(warning_text, shift=UP * 0.3),
            run_time=1
        )
        self.wait(3)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 2 — Patient Registration
    # ════════════════════════════════════════════
    def scene_2_patient_registration(self):
        self.camera.background_color = BG_LIGHT
        self.add_voice("scene2")
        
        header = self.show_scene_badge(2, "Patient आता है", "Information बंट जाती है")
        
        # Patient in center
        patient_img = ImageMobject(get_asset("patient.jpg")).scale_to_fit_height(2.5)
        patient_img.move_to(ORIGIN + DOWN * 0.3)
        
        patient_label = Text("Patient", font="Arial", font_size=18, color=TEXT_MUTED)
        patient_label.next_to(patient_img, DOWN, buff=0.1)
        
        self.play(FadeIn(patient_img, scale=0.8), FadeIn(patient_label), run_time=1)
        self.wait(2)
        
        # Four department nodes around patient
        dept_data = [
            ("Reception", "📋", UP * 2.5 + LEFT * 3, "#3B82F6"),
            ("Doctor", "📄", UP * 2.5 + RIGHT * 3, SUCCESS),
            ("Nurse", "📝", DOWN * 2.8 + LEFT * 3, "#EC4899"),
            ("Billing", "🧾", DOWN * 2.8 + RIGHT * 3, WARNING),
        ]
        
        dept_groups = []
        for name, icon, pos, color in dept_data:
            box = RoundedRectangle(
                corner_radius=0.2, width=2.2, height=1.2,
                fill_color=color, fill_opacity=0.08,
                stroke_color=color, stroke_width=1.5
            ).move_to(pos)
            
            dept_name = Text(name, font="Arial", font_size=18, color=color, weight=BOLD)
            dept_name.move_to(box.get_center() + UP * 0.15)
            
            dept_icon = Text(icon, font_size=28)
            dept_icon.move_to(box.get_center() + DOWN * 0.25)
            
            group = VGroup(box, dept_name, dept_icon)
            dept_groups.append(group)
            
            # Dashed line from patient to department (disconnected)
            line = DashedLine(
                patient_img.get_center(), pos,
                dash_length=0.1, color=DANGER, stroke_opacity=0.5
            )
            
            self.play(
                FadeIn(group, scale=0.8),
                Create(line),
                run_time=0.6
            )
        
        self.wait(1)
        
        # Quote
        quote_text = Text(
            '"Patient एक है… लेकिन उसकी information कई जगह बंटी हुई है।"',
            font="Arial", font_size=22, color=DANGER, weight=BOLD
        ).to_edge(DOWN, buff=0.4)
        
        self.play(FadeIn(quote_text, shift=UP * 0.3), run_time=0.8)
        self.wait(4)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 3 — History Problem
    # ════════════════════════════════════════════
    def scene_3_history_problem(self):
        self.camera.background_color = BG_AMBER_LIGHT
        self.add_voice("scene3")
        
        header = self.show_scene_badge(3, "पुरानी History", "ढूँढने की Problem", WARNING)
        
        # Doctor searching
        doctor_img = ImageMobject(get_asset("doctor.jpg")).scale_to_fit_height(2.8)
        doctor_img.move_to(LEFT * 3 + DOWN * 0.5)
        
        thought = VGroup(
            RoundedRectangle(
                corner_radius=0.3, width=3.5, height=0.8,
                fill_color=WHITE, fill_opacity=1,
                stroke_color=WARNING, stroke_width=1.5
            ),
            Text("File कहाँ है? 🤔", font="Arial", font_size=20, color=TEXT_DARK)
        ).arrange(ORIGIN).next_to(doctor_img, UR, buff=0.1)
        
        self.play(FadeIn(doctor_img), run_time=0.8)
        self.play(FadeIn(thought, scale=0.5), run_time=0.5)
        
        # Flying files
        file_emojis = ["📁", "📋", "📄", "🗂️", "📑", "📁", "📋", "📄"]
        files = []
        for i, emoji in enumerate(file_emojis):
            f = Text(emoji, font_size=32)
            angle = i * (TAU / len(file_emojis))
            f.move_to(RIGHT * 1.5 + np.array([2 * np.cos(angle), 1.8 * np.sin(angle) - 0.3, 0]))
            files.append(f)
        
        self.play(*[FadeIn(f, scale=0.5) for f in files], run_time=0.8)
        
        # Animate files floating
        self.play(
            *[Rotate(f, angle=0.3 * (-1)**i, about_point=RIGHT * 1.5 + DOWN * 0.3) for i, f in enumerate(files)],
            run_time=2
        )
        
        # Questions
        questions = [
            "File कहाँ है?",
            "किस register में है?",
            "पिछला treatment क्या था?",
            "कोई allergy थी या नहीं?"
        ]
        
        q_group = VGroup()
        for i, q in enumerate(questions):
            q_box = VGroup(
                RoundedRectangle(
                    corner_radius=0.15, width=5, height=0.5,
                    fill_color=WHITE, fill_opacity=0.9,
                    stroke_color=WARNING, stroke_width=1
                ),
                Text(f"❓ {q}", font="Arial", font_size=18, color=TEXT_DARK)
            ).arrange(ORIGIN)
            q_group.add(q_box)
        
        q_group.arrange(DOWN, buff=0.1).to_edge(RIGHT, buff=0.8).shift(DOWN * 0.5)
        
        for q in q_group:
            self.play(FadeIn(q, shift=LEFT * 0.3), run_time=0.4)
        
        # Timer
        timer_text = Text("⏱️ Time बीत रहा है...", font="Arial", font_size=22, color=DANGER, weight=BOLD)
        timer_text.to_edge(DOWN, buff=0.5)
        self.play(FadeIn(timer_text), run_time=0.5)
        
        self.wait(5)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 4 — Bed Availability
    # ════════════════════════════════════════════
    def scene_4_bed_availability(self):
        self.camera.background_color = BG_RED_LIGHT
        self.add_voice("scene4")
        
        header = self.show_scene_badge(4, "Emergency Patient", "Bed Available है?", DANGER)
        
        # Ambulance
        ambulance = Text("🚑", font_size=60).move_to(LEFT * 6 + DOWN * 0.5)
        self.play(ambulance.animate.move_to(LEFT * 2 + DOWN * 0.5), run_time=1.5)
        
        # Flow steps
        steps = [
            ("🧑‍💼", "Receptionist\nपूछता है"),
            ("🏃", "Staff ward\nमें जाता है"),
            ("🔍", "Check\nकरता है"),
            ("🏃‍♂️", "वापस आकर\nबताता है"),
        ]
        
        flow_group = VGroup()
        for i, (icon, label) in enumerate(steps):
            step_icon = Text(icon, font_size=36)
            step_label = Text(label, font="Arial", font_size=14, color=TEXT_MUTED)
            step_box = VGroup(
                RoundedRectangle(
                    corner_radius=0.2, width=2, height=1.5,
                    fill_color=WHITE, fill_opacity=0.9,
                    stroke_color=DANGER, stroke_width=1
                ),
                step_icon, step_label
            )
            step_icon.move_to(step_box[0].get_center() + UP * 0.2)
            step_label.move_to(step_box[0].get_center() + DOWN * 0.35)
            flow_group.add(step_box)
        
        flow_group.arrange(RIGHT, buff=0.3).move_to(DOWN * 0.3)
        
        # Arrows between steps
        arrows = []
        for i in range(len(steps) - 1):
            arrow = Arrow(
                flow_group[i].get_right(), flow_group[i+1].get_left(),
                buff=0.1, color=DANGER, stroke_width=2.5
            )
            arrows.append(arrow)
        
        for i, step in enumerate(flow_group):
            anims = [FadeIn(step, scale=0.8)]
            if i > 0:
                anims.append(Create(arrows[i-1]))
            self.play(*anims, run_time=0.6)
        
        # Critical warning
        critical = VGroup(
            Text("⏰", font_size=40),
            Text(
                '"Emergency में ये delay बहुत भारी पड़ सकता है।"',
                font="Arial", font_size=24, color=DANGER, weight=BOLD
            )
        ).arrange(RIGHT, buff=0.3).to_edge(DOWN, buff=0.5)
        
        self.play(FadeIn(critical, shift=UP * 0.3), run_time=0.8)
        self.wait(5)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 5 — Clinical Records
    # ════════════════════════════════════════════
    def scene_5_clinical_records(self):
        self.camera.background_color = BG_LIGHT
        self.add_voice("scene5")
        
        header = self.show_scene_badge(5, "Clinical Records", "कागज़ों का ढेर")
        
        # Nurse recording vitals
        nurse_img = ImageMobject(get_asset("nurse.jpg")).scale_to_fit_height(2.5)
        nurse_img.move_to(LEFT * 4 + DOWN * 0.5)
        self.play(FadeIn(nurse_img), run_time=0.8)
        
        # Vital cards
        vitals = [
            ("❤️ BP", "120/80", SUCCESS),
            ("🌡️ Temp", "98.6°F", "#3B82F6"),
            ("🫁 SpO₂", "96%", PRIMARY),
        ]
        
        vital_group = VGroup()
        for name, val, color in vitals:
            card = VGroup(
                RoundedRectangle(
                    corner_radius=0.15, width=2.5, height=0.6,
                    fill_color=color, fill_opacity=0.08,
                    stroke_color=color, stroke_width=1.5
                ),
                Text(f"{name}: {val}", font="Arial", font_size=16, color=color, weight=BOLD)
            ).arrange(ORIGIN)
            vital_group.add(card)
        
        vital_group.arrange(DOWN, buff=0.15).move_to(LEFT * 1 + DOWN * 0.5)
        
        for v in vital_group:
            self.play(FadeIn(v, shift=RIGHT * 0.3), run_time=0.4)
        
        # Paper pile
        papers = [
            "📄 Vitals Sheet", "📝 Medication Chart", "📋 Nurse Notes",
            "📄 Doctor Orders", "📝 Lab Results", "📋 More Papers..."
        ]
        
        paper_group = VGroup()
        for i, p in enumerate(papers):
            paper = VGroup(
                RoundedRectangle(
                    corner_radius=0.1, width=3, height=0.5,
                    fill_color=WARNING, fill_opacity=0.06,
                    stroke_color=WARNING, stroke_width=1
                ),
                Text(p, font="Arial", font_size=14, color=WARNING)
            ).arrange(ORIGIN)
            paper.rotate(0.02 * (-1)**i)
            paper_group.add(paper)
        
        paper_group.arrange(DOWN, buff=0.05).move_to(RIGHT * 3 + DOWN * 0.3)
        
        self.play(
            *[FadeIn(p, shift=DOWN * 0.1) for p in paper_group],
            run_time=1
        )
        
        # Warning
        warning = Text(
            '"अगर कोई paper खो गया तो?"',
            font="Arial", font_size=24, color=DANGER, weight=BOLD
        ).to_edge(DOWN, buff=0.5)
        
        self.play(FadeIn(warning, shift=UP * 0.3), run_time=0.8)
        self.wait(5)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 6 — Billing Problem
    # ════════════════════════════════════════════
    def scene_6_billing_problem(self):
        self.camera.background_color = BG_AMBER_LIGHT
        self.add_voice("scene6")
        
        header = self.show_scene_badge(6, "Billing की", "लंबी Process", WARNING)
        
        # Charge items
        charges = [
            "Doctor Charges", "Medicines", "Nursing Charges",
            "Oxygen / Equipment", "Lab Tests", "Other Services"
        ]
        
        charge_group = VGroup()
        for c in charges:
            item = VGroup(
                RoundedRectangle(
                    corner_radius=0.12, width=5, height=0.55,
                    fill_color=WHITE, fill_opacity=0.9,
                    stroke_color=BORDER_COLOR, stroke_width=1
                ),
                Text(c, font="Arial", font_size=16, color=TEXT_DARK).align_to(LEFT * 1.8, LEFT),
                Text("₹ ???", font="Arial", font_size=16, color=WARNING, weight=BOLD).align_to(RIGHT * 1.8, RIGHT)
            )
            charge_group.add(item)
        
        charge_group.arrange(DOWN, buff=0.08).move_to(LEFT * 1.5 + DOWN * 0.3)
        
        # Calculator
        calc = Text("🧮", font_size=50).next_to(charge_group, UP, buff=0.3)
        self.play(FadeIn(calc), run_time=0.5)
        
        for ch in charge_group:
            self.play(FadeIn(ch, shift=RIGHT * 0.3), run_time=0.35)
        
        # Patient waiting
        patient_img = ImageMobject(get_asset("patient.jpg")).scale_to_fit_height(2)
        patient_img.move_to(RIGHT * 4 + DOWN * 0.3)
        self.play(FadeIn(patient_img), run_time=0.5)
        
        wait_texts = VGroup(
            Text('"Patient ready है..."', font="Arial", font_size=16, color=TEXT_MUTED),
            Text('"Bill अभी ready नहीं"', font="Arial", font_size=18, color=DANGER, weight=BOLD),
            Text("⏳", font_size=40)
        ).arrange(DOWN, buff=0.2).next_to(patient_img, DOWN, buff=0.2)
        
        self.play(FadeIn(wait_texts), run_time=0.8)
        self.wait(5)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 7 — Privacy Problem
    # ════════════════════════════════════════════
    def scene_7_privacy_problem(self):
        self.camera.background_color = BG_PURPLE_LIGHT
        self.add_voice("scene7")
        
        header = self.show_scene_badge(7, "सबको सब कुछ", "क्यों दिखे?", "#7C3AED")
        
        # Screen mockup
        screen_frame = VGroup(
            RoundedRectangle(
                corner_radius=0.2, width=5, height=3.5,
                fill_color=WHITE, fill_opacity=1,
                stroke_color="#D1D5DB", stroke_width=2
            ),
            # Title bar
            Rectangle(width=5, height=0.4, fill_color="#F3F4F6", fill_opacity=1, stroke_width=0)
                .align_to(ORIGIN, UP).shift(UP * 1.35),
            # Dots
            Dot(color="#EF4444", radius=0.06).move_to(UP * 1.35 + LEFT * 2.1),
            Dot(color="#F59E0B", radius=0.06).move_to(UP * 1.35 + LEFT * 1.9),
            Dot(color="#10B981", radius=0.06).move_to(UP * 1.35 + LEFT * 1.7),
        ).move_to(LEFT * 2.5 + DOWN * 0.3)
        
        # Data rows with eye icon
        data_items = [
            ("Patient Data", "👁️"),
            ("Financial Info", "👁️"),
            ("Medical Records", "👁️"),
            ("Admin Reports", "👁️"),
        ]
        
        data_group = VGroup()
        for name, eye in data_items:
            row = VGroup(
                RoundedRectangle(
                    corner_radius=0.1, width=4.2, height=0.45,
                    fill_color="#F8FAFC", fill_opacity=1,
                    stroke_width=0
                ),
                Text(name, font="Arial", font_size=14, color=TEXT_DARK),
                Text(eye, font_size=18)
            )
            row[1].align_to(row[0].get_left() + RIGHT * 0.3, LEFT)
            row[2].align_to(row[0].get_right() + LEFT * 0.4, RIGHT)
            data_group.add(row)
        
        data_group.arrange(DOWN, buff=0.08).move_to(screen_frame[0].get_center() + DOWN * 0.2)
        
        self.play(FadeIn(screen_frame), FadeIn(data_group), run_time=1)
        
        # Role cards
        roles = [
            ("👨‍⚕️", "Doctor → Medical Info"),
            ("👩‍⚕️", "Nurse → Treatment Info"),
            ("👩‍💼", "Reception → Admission"),
            ("👨‍💼", "Admin → Overview"),
        ]
        
        role_group = VGroup()
        for icon, label in roles:
            card = VGroup(
                RoundedRectangle(
                    corner_radius=0.15, width=3.5, height=0.6,
                    fill_color=WHITE, fill_opacity=0.9,
                    stroke_color=PRIMARY, stroke_width=1
                ),
                Text(f"{icon}  {label}", font="Arial", font_size=15, color=TEXT_DARK)
            ).arrange(ORIGIN)
            role_group.add(card)
        
        role_group.arrange(DOWN, buff=0.1).move_to(RIGHT * 3 + DOWN * 0.3)
        
        for card in role_group:
            self.play(FadeIn(card, shift=LEFT * 0.3), run_time=0.4)
        
        # Quote
        quote = Text(
            '"Information वही दिखनी चाहिए, जिसकी जरूरत है।"',
            font="Arial", font_size=22, color=PRIMARY, weight=BOLD
        ).to_edge(DOWN, buff=0.4)
        
        self.play(FadeIn(quote, shift=UP * 0.3), run_time=0.8)
        self.wait(4)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 8 — Communication Gap
    # ════════════════════════════════════════════
    def scene_8_communication_gap(self):
        self.camera.background_color = BG_WHITE
        self.add_voice("scene8")
        
        header = self.show_scene_badge(8, "Communication", "Gap", DANGER)
        
        # Four departments in a grid
        depts = [
            ("👨‍⚕️", "Doctor", "Instructions दिए ✍️", SUCCESS),
            ("👩‍⚕️", "Nurse", "पता नहीं ❌", DANGER),
            ("👩‍💼", "Reception", "पता नहीं ❌", DANGER),
            ("🧾", "Billing", "पता नहीं ❌", DANGER),
        ]
        
        positions = [
            LEFT * 3 + UP * 0.5, RIGHT * 3 + UP * 0.5,
            LEFT * 3 + DOWN * 2, RIGHT * 3 + DOWN * 2
        ]
        
        dept_nodes = []
        for (icon, name, status, color), pos in zip(depts, positions):
            box = RoundedRectangle(
                corner_radius=0.2, width=2.8, height=1.6,
                fill_color=color, fill_opacity=0.06,
                stroke_color=color, stroke_width=1.5
            ).move_to(pos)
            
            dept_icon = Text(icon, font_size=36).move_to(pos + UP * 0.3)
            dept_name = Text(name, font="Arial", font_size=16, color=TEXT_DARK, weight=BOLD).move_to(pos)
            dept_status = Text(status, font="Arial", font_size=12, color=color).move_to(pos + DOWN * 0.35)
            
            group = VGroup(box, dept_icon, dept_name, dept_status)
            dept_nodes.append(group)
        
        for node in dept_nodes:
            self.play(FadeIn(node, scale=0.85), run_time=0.5)
        
        # Broken lines between departments
        for i in range(len(dept_nodes)):
            for j in range(i+1, len(dept_nodes)):
                line = DashedLine(
                    dept_nodes[i][0].get_center(),
                    dept_nodes[j][0].get_center(),
                    dash_length=0.12, color=DANGER, stroke_opacity=0.4
                )
                self.play(Create(line), run_time=0.3)
        
        # Quote
        quote = VGroup(
            Text('"सब एक ही patient के लिए काम कर रहे हैं।"', font="Arial", font_size=18, color=TEXT_DARK),
            Text('"फिर भी information time पर नहीं पहुँचती।"', font="Arial", font_size=20, color=DANGER, weight=BOLD)
        ).arrange(DOWN, buff=0.1).to_edge(DOWN, buff=0.4)
        
        self.play(FadeIn(quote, shift=UP * 0.3), run_time=0.8)
        self.wait(4)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 9 — Management Problem
    # ════════════════════════════════════════════
    def scene_9_management_problem(self):
        self.camera.background_color = BG_AMBER_LIGHT
        self.add_voice("scene9")
        
        header = self.show_scene_badge(9, "Management की", "Blind Spot", WARNING)
        
        # Admin character
        admin_img = ImageMobject(get_asset("admin.jpg")).scale_to_fit_height(2.5)
        admin_img.move_to(LEFT * 4 + DOWN * 0.3)
        self.play(FadeIn(admin_img), run_time=0.8)
        
        # Management questions
        questions = [
            "📊 आज कितने patients हैं?",
            "🛏️ कितने beds occupied हैं?",
            "₹ कितना revenue आया?",
            "⏰ कितना pending है?",
            "🏢 कौन सा dept कितना काम कर रहा?"
        ]
        
        q_group = VGroup()
        for q in questions:
            item = VGroup(
                RoundedRectangle(
                    corner_radius=0.12, width=5.5, height=0.5,
                    fill_color=WHITE, fill_opacity=0.9,
                    stroke_color=WARNING, stroke_width=1
                ),
                Text(q, font="Arial", font_size=15, color=TEXT_DARK)
            ).arrange(ORIGIN)
            q_group.add(item)
        
        q_group.arrange(DOWN, buff=0.08).move_to(RIGHT * 1.5 + DOWN * 0.3)
        
        for q in q_group:
            self.play(FadeIn(q, shift=LEFT * 0.3), run_time=0.35)
        
        # Quote
        quote = Text(
            '"Management decision लेगा किसके basis पर?"',
            font="Arial", font_size=22, color=DANGER, weight=BOLD
        ).to_edge(DOWN, buff=0.4)
        
        self.play(FadeIn(quote, shift=UP * 0.3), run_time=0.8)
        self.wait(4)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 10 — Emotional Peak
    # ════════════════════════════════════════════
    def scene_10_emotional_peak(self):
        self.camera.background_color = BG_RED_LIGHT
        self.add_voice("scene10")
        
        header = self.show_scene_badge(10, "सारी Problems", "एक नज़र में", DANGER)
        
        # Problems grid
        problems = [
            ("📁", "Scattered Files"),
            ("🛏️", "Bed Confusion"),
            ("💊", "Medication Gaps"),
            ("🧾", "Billing Delays"),
            ("📡", "Comm. Gap"),
            ("🔓", "No Privacy"),
            ("📊", "No Reports"),
        ]
        
        cards = VGroup()
        for icon, name in problems:
            card = VGroup(
                RoundedRectangle(
                    corner_radius=0.15, width=1.7, height=1.3,
                    fill_color=DANGER, fill_opacity=0.06,
                    stroke_color=DANGER, stroke_width=1
                ),
                Text(icon, font_size=30),
                Text(name, font="Arial", font_size=11, color=DANGER, weight=BOLD)
            )
            card[1].move_to(card[0].get_center() + UP * 0.15)
            card[2].move_to(card[0].get_center() + DOWN * 0.3)
            cards.add(card)
        
        # Arrange in two rows
        row1 = VGroup(*cards[:4]).arrange(RIGHT, buff=0.2)
        row2 = VGroup(*cards[4:]).arrange(RIGHT, buff=0.2)
        grid = VGroup(row1, row2).arrange(DOWN, buff=0.2).move_to(DOWN * 0.2)
        
        self.play(*[FadeIn(c, scale=0.7) for c in cards], run_time=1.2)
        
        self.wait(2)
        
        # Emotional text
        emotional = VGroup(
            Text(
                '"Information सही समय पर नहीं पहुँच पाती।"',
                font="Arial", font_size=20, color=TEXT_DARK
            ),
            Text(
                '"Healthcare में delay सिर्फ inconvenience नहीं होती।"',
                font="Arial", font_size=22, color=DANGER, weight=BOLD
            )
        ).arrange(DOWN, buff=0.15).to_edge(DOWN, buff=0.5)
        
        self.play(FadeIn(emotional, shift=UP * 0.3), run_time=1)
        self.wait(5)
        
        # Fade to black
        self.play(FadeOut(*self.mobjects), run_time=1.5)
        self.camera.background_color = "#0A0A1E"
        self.wait(2)

    # ════════════════════════════════════════════
    # SCENE 11 — Solution Reveal
    # ════════════════════════════════════════════
    def scene_11_solution_reveal(self):
        self.camera.background_color = "#0A0A1E"
        self.add_voice("scene11")
        
        # Dark pause with thought text
        thought1 = Text(
            '"तो हमने सोचा…"',
            font="Arial", font_size=30, color=WHITE, weight=BOLD
        )
        self.play(FadeIn(thought1), run_time=1)
        self.wait(1.5)
        self.play(FadeOut(thought1), run_time=0.5)
        
        thought2 = Text(
            '"क्यों ना hospital के पूरे काम को\nएक जगह लाया जाए?"',
            font="Arial", font_size=28, color="#818CF8", weight=BOLD
        )
        self.play(FadeIn(thought2, scale=0.8), run_time=1)
        self.wait(2)
        self.play(FadeOut(thought2), run_time=0.5)
        
        # Transition to light
        self.camera.background_color = BG_LIGHT
        
        # Solution features
        features = [
            "✅ Patient की information बिखरी ना हो",
            "✅ Bed की स्थिति तुरंत पता चले",
            "✅ Clinical record आसानी से maintain हो",
            "✅ Billing automatically organized हो",
            "✅ सिर्फ वही information मिले जिसकी जरूरत है",
            "✅ Hospital एक नजर में समझ सकें",
        ]
        
        feat_group = VGroup()
        for f in features:
            item = VGroup(
                RoundedRectangle(
                    corner_radius=0.12, width=7, height=0.55,
                    fill_color=PRIMARY, fill_opacity=0.06,
                    stroke_color=PRIMARY, stroke_width=1
                ),
                Text(f, font="Arial", font_size=16, color=TEXT_DARK)
            ).arrange(ORIGIN)
            feat_group.add(item)
        
        feat_group.arrange(DOWN, buff=0.08).move_to(UP * 0.5)
        
        for f in feat_group:
            self.play(FadeIn(f, shift=RIGHT * 0.3), run_time=0.4)
        
        self.wait(1)
        
        # Logo reveal
        self.play(FadeOut(feat_group), run_time=0.8)
        
        logo = ImageMobject(get_asset("logo.png")).scale_to_fit_height(2)
        logo.move_to(UP * 1)
        
        system_name = Text(
            "CHAUDHARY HEALTH CARE CENTER",
            font="Arial", font_size=32, color=TEXT_DARK, weight=BOLD
        ).next_to(logo, DOWN, buff=0.4)
        
        subtitle = Text(
            "Hospital Management System",
            font="Arial", font_size=20, color=PRIMARY
        ).next_to(system_name, DOWN, buff=0.15)
        
        # Glow circle behind logo
        glow = Circle(radius=1.5, fill_color=PRIMARY, fill_opacity=0.08, stroke_width=0)
        glow.move_to(logo.get_center())
        
        self.play(
            FadeIn(glow, scale=0.5),
            FadeIn(logo, scale=0.5),
            run_time=1.5
        )
        self.play(
            FadeIn(system_name, shift=UP * 0.3),
            FadeIn(subtitle, shift=UP * 0.3),
            run_time=1
        )
        
        self.wait(3)
        self.scene_transition(BG_GREEN_LIGHT)

    # ════════════════════════════════════════════
    # SCENE 12 — Solution Transformation
    # ════════════════════════════════════════════
    def scene_12_transformation(self):
        self.camera.background_color = BG_GREEN_LIGHT
        self.add_voice("scene12")
        
        header = self.show_scene_badge(12, "Connected System", "सब कुछ जुड़ा हुआ", SUCCESS)
        
        # Connected flow
        flow_steps = [
            ("🧑", "Patient\nआया"),
            ("💻", "Reception\nInfo Enter"),
            ("📱", "Auto\nAvailable"),
        ]
        
        flow_group = VGroup()
        for icon, label in flow_steps:
            box = VGroup(
                RoundedRectangle(
                    corner_radius=0.2, width=2.2, height=1.4,
                    fill_color=SUCCESS, fill_opacity=0.08,
                    stroke_color=SUCCESS, stroke_width=1.5
                ),
                Text(icon, font_size=32),
                Text(label, font="Arial", font_size=13, color=TEXT_DARK),
                Text("✅", font_size=18)
            )
            box[1].move_to(box[0].get_center() + UP * 0.2)
            box[2].move_to(box[0].get_center() + DOWN * 0.2)
            box[3].move_to(box[0].get_corner(UR) + LEFT * 0.15 + DOWN * 0.15)
            flow_group.add(box)
        
        flow_group.arrange(RIGHT, buff=0.5).move_to(UP * 0.3)
        
        # Connected lines (solid green)
        lines = []
        for i in range(len(flow_steps) - 1):
            line = Arrow(
                flow_group[i].get_right(), flow_group[i+1].get_left(),
                buff=0.1, color=SUCCESS, stroke_width=3
            )
            lines.append(line)
        
        for i, step in enumerate(flow_group):
            anims = [FadeIn(step, scale=0.8)]
            if i > 0:
                anims.append(Create(lines[i-1]))
            self.play(*anims, run_time=0.6)
        
        # Solution screens
        screens_data = [
            ("🛏️ Bed Mgmt", ["Bed #3 Available ✅", "Bed #1 Occupied 🔴"], SUCCESS),
            ("👨‍⚕️ Doctor", ["History ✅", "Allergies ✅"], "#3B82F6"),
            ("👩‍⚕️ Nurse", ["Vitals ✅", "Medication ✅"], "#EC4899"),
            ("🧾 Billing", ["All Auto ✅", "₹12,500 ✅"], WARNING),
        ]
        
        screen_group = VGroup()
        for title, items, color in screens_data:
            card = VGroup(
                RoundedRectangle(
                    corner_radius=0.15, width=2.5, height=1.5,
                    fill_color=color, fill_opacity=0.06,
                    stroke_color=color, stroke_width=1
                ),
                Text(title, font="Arial", font_size=13, color=color, weight=BOLD),
                *[Text(item, font="Arial", font_size=11, color=TEXT_MUTED) for item in items]
            )
            card[1].move_to(card[0].get_top() + DOWN * 0.25)
            for idx, item_text in enumerate(card[2:]):
                item_text.move_to(card[0].get_center() + DOWN * (0.1 + idx * 0.25))
            screen_group.add(card)
        
        screen_group.arrange(RIGHT, buff=0.15).move_to(DOWN * 1.8)
        
        self.play(*[FadeIn(s, shift=UP * 0.3) for s in screen_group], run_time=1)
        
        # Notification
        notif = VGroup(
            Text("🔔", font_size=24),
            Text("Patient discharged → Billing notified ✅", font="Arial", font_size=14, color=SUCCESS)
        ).arrange(RIGHT, buff=0.2).to_edge(DOWN, buff=0.4)
        
        self.play(FadeIn(notif, shift=UP * 0.3), run_time=0.8)
        self.wait(5)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 13 — Role-Based Access
    # ════════════════════════════════════════════
    def scene_13_role_based_access(self):
        self.camera.background_color = BG_LIGHT
        self.add_voice("scene13")
        
        header = self.show_scene_badge(13, "Role-Based Access", "हर किसी का अपना Access", PRIMARY)
        
        roles = [
            ("admin.jpg", "Admin", ["📊 Revenue Dashboard", "👥 Staff Management", "🏥 Hospital Overview"], "🛡️ Full Access"),
            ("doctor.jpg", "Doctor", ["📋 Patient Records", "💊 Prescriptions", "📝 Clinical Notes"], "🔒 Clinical Access"),
            ("nurse.jpg", "Staff", ["❤️ Vitals Entry", "💉 Medication", "📋 Daily Notes"], "🔒 Care Access"),
            ("receptionist.jpg", "Reception", ["➕ Registration", "🛏️ Admission", "📞 Patient Info"], "🔒 Front Desk Access"),
        ]
        
        cards = VGroup()
        for img_name, name, features, access in roles:
            card_bg = RoundedRectangle(
                corner_radius=0.2, width=2.8, height=3.8,
                fill_color=WHITE, fill_opacity=1,
                stroke_color=BORDER_COLOR, stroke_width=1
            )
            
            char_img = ImageMobject(get_asset(img_name)).scale_to_fit_height(1.4)
            char_img.move_to(card_bg.get_top() + DOWN * 0.9)
            
            role_name = Text(name, font="Arial", font_size=18, color=TEXT_DARK, weight=BOLD)
            role_name.move_to(card_bg.get_top() + DOWN * 1.8)
            
            feat_texts = VGroup()
            for i, f in enumerate(features):
                ft = Text(f, font="Arial", font_size=10, color=TEXT_MUTED)
                ft.move_to(card_bg.get_top() + DOWN * (2.2 + i * 0.3))
                feat_texts.add(ft)
            
            access_badge = VGroup(
                RoundedRectangle(
                    corner_radius=0.1, width=2.2, height=0.35,
                    fill_color=PRIMARY, fill_opacity=0.08,
                    stroke_color=PRIMARY, stroke_width=1
                ),
                Text(access, font="Arial", font_size=10, color=PRIMARY, weight=BOLD)
            ).arrange(ORIGIN).move_to(card_bg.get_bottom() + UP * 0.35)
            
            card = VGroup(card_bg, char_img, role_name, feat_texts, access_badge)
            cards.add(card)
        
        cards.arrange(RIGHT, buff=0.25).move_to(DOWN * 0.3)
        
        # Scale down if too wide
        if cards.get_width() > 12:
            cards.scale_to_fit_width(12)
        
        for card in cards:
            self.play(FadeIn(card, shift=UP * 0.3), run_time=0.5)
        
        # Quote
        quote = VGroup(
            Text('"सिस्टम सबको जोड़ता है…"', font="Arial", font_size=20, color=SUCCESS, weight=BOLD),
            Text('"लेकिन हर किसी को सब कुछ नहीं देता।"', font="Arial", font_size=20, color=TEXT_DARK, weight=BOLD)
        ).arrange(DOWN, buff=0.1).to_edge(DOWN, buff=0.3)
        
        self.play(FadeIn(quote, shift=UP * 0.3), run_time=0.8)
        self.wait(4)
        self.scene_transition()

    # ════════════════════════════════════════════
    # SCENE 14 — Before vs After (FINALE)
    # ════════════════════════════════════════════
    def scene_14_before_after(self):
        self.camera.background_color = BG_WHITE
        self.add_voice("scene14")
        
        badge = VGroup(
            RoundedRectangle(
                corner_radius=0.15, width=3, height=0.5,
                fill_color=PRIMARY, fill_opacity=0.1,
                stroke_color=PRIMARY, stroke_width=1.5
            ),
            Text("🎬 GRAND FINALE", font="Arial", font_size=18, color=PRIMARY, weight=BOLD)
        ).arrange(ORIGIN).to_edge(UP, buff=0.4)
        self.play(FadeIn(badge), run_time=0.5)
        
        # Before side
        before_items = [
            "📄 Paper & Registers",
            "😵 Confusion",
            "⏳ Waiting",
            "✋ Manual Work",
            "🧩 Info Scattered"
        ]
        
        before_bg = RoundedRectangle(
            corner_radius=0.2, width=5, height=4,
            fill_color=DANGER, fill_opacity=0.04,
            stroke_color=DANGER, stroke_width=1.5
        ).move_to(LEFT * 3.5 + DOWN * 0.5)
        
        before_title = Text("❌ BEFORE", font="Arial", font_size=22, color=DANGER, weight=BOLD)
        before_title.move_to(before_bg.get_top() + DOWN * 0.4)
        
        before_list = VGroup()
        for i, item in enumerate(before_items):
            t = VGroup(
                RoundedRectangle(
                    corner_radius=0.1, width=4.2, height=0.45,
                    fill_color=DANGER, fill_opacity=0.06, stroke_width=0
                ),
                Text(item, font="Arial", font_size=14, color="#B91C1C")
            ).arrange(ORIGIN)
            before_list.add(t)
        before_list.arrange(DOWN, buff=0.06).move_to(before_bg.get_center() + DOWN * 0.2)
        
        # After side
        after_items = [
            "💻 One System",
            "🔗 Connected Departments",
            "📁 Organized Records",
            "⚡ Faster Work",
            "🔐 Controlled Access"
        ]
        
        after_bg = RoundedRectangle(
            corner_radius=0.2, width=5, height=4,
            fill_color=SUCCESS, fill_opacity=0.04,
            stroke_color=SUCCESS, stroke_width=1.5
        ).move_to(RIGHT * 3.5 + DOWN * 0.5)
        
        after_title = Text("✅ AFTER", font="Arial", font_size=22, color=SUCCESS, weight=BOLD)
        after_title.move_to(after_bg.get_top() + DOWN * 0.4)
        
        after_list = VGroup()
        for item in after_items:
            t = VGroup(
                RoundedRectangle(
                    corner_radius=0.1, width=4.2, height=0.45,
                    fill_color=SUCCESS, fill_opacity=0.06, stroke_width=0
                ),
                Text(item, font="Arial", font_size=14, color="#065F46")
            ).arrange(ORIGIN)
            after_list.add(t)
        after_list.arrange(DOWN, buff=0.06).move_to(after_bg.get_center() + DOWN * 0.2)
        
        # VS circle
        vs = VGroup(
            Circle(radius=0.35, fill_color=WHITE, fill_opacity=1, stroke_color=BORDER_COLOR, stroke_width=2),
            Text("VS", font="Arial", font_size=16, color=TEXT_MUTED, weight=BOLD)
        ).arrange(ORIGIN).move_to(DOWN * 0.5)
        
        # Animate
        self.play(
            FadeIn(before_bg), FadeIn(before_title),
            FadeIn(after_bg), FadeIn(after_title),
            FadeIn(vs),
            run_time=0.8
        )
        
        for b, a in zip(before_list, after_list):
            self.play(
                FadeIn(b, shift=RIGHT * 0.2),
                FadeIn(a, shift=LEFT * 0.2),
                run_time=0.4
            )
        
        self.wait(3)
        
        # Final reveal
        self.play(FadeOut(*self.mobjects), run_time=1)
        self.camera.background_color = BG_LIGHT
        
        # Logo + final tagline
        logo = ImageMobject(get_asset("logo.png")).scale_to_fit_height(1.8)
        logo.move_to(UP * 1.5)
        
        final_name = Text(
            "CHAUDHARY HEALTH CARE CENTER",
            font="Arial", font_size=30, color=TEXT_DARK, weight=BOLD
        ).next_to(logo, DOWN, buff=0.3)
        
        final_sub = Text(
            "Hospital Management System",
            font="Arial", font_size=18, color=PRIMARY
        ).next_to(final_name, DOWN, buff=0.1)
        
        line1 = Line(LEFT * 2, RIGHT * 2, color=PRIMARY, stroke_width=1.5).next_to(final_sub, DOWN, buff=0.4)
        
        tagline1 = Text(
            "ONE HOSPITAL. ONE SYSTEM.",
            font="Arial", font_size=24, color=TEXT_DARK, weight=BOLD
        ).next_to(line1, DOWN, buff=0.2)
        
        tagline2 = Text(
            "BETTER CARE. BETTER MANAGEMENT.",
            font="Arial", font_size=22, color=PRIMARY, weight=BOLD
        ).next_to(tagline1, DOWN, buff=0.15)
        
        line2 = Line(LEFT * 2, RIGHT * 2, color=PRIMARY, stroke_width=1.5).next_to(tagline2, DOWN, buff=0.2)
        
        glow = Circle(radius=1.5, fill_color=PRIMARY, fill_opacity=0.06, stroke_width=0)
        glow.move_to(logo.get_center())
        
        self.play(
            FadeIn(glow, scale=0.5),
            FadeIn(logo, scale=0.5),
            run_time=1.5
        )
        self.play(FadeIn(final_name, shift=UP * 0.3), FadeIn(final_sub, shift=UP * 0.3), run_time=1)
        self.play(Create(line1), run_time=0.5)
        self.play(FadeIn(tagline1), run_time=0.8)
        self.play(FadeIn(tagline2), run_time=0.8)
        self.play(Create(line2), run_time=0.5)
        
        self.wait(5)
        
        # Final fade out
        self.play(FadeOut(*self.mobjects), run_time=2)
        self.wait(1)
