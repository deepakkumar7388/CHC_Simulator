import os
import subprocess

AUDIO_DIR = r"c:\MY_PROJECTS\HP\Simulator\audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

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

print("Generating audio files with edge-tts...")
# Using SwaraNeural which has an extremely professional, premium presentation voice
VOICE = "hi-IN-SwaraNeural"

for key, text in SCRIPTS.items():
    filepath = os.path.join(AUDIO_DIR, f"{key}.mp3")
    print(f"Generating: {key}.mp3")
    try:
        # Increase speed to +15% to match fast animations
        subprocess.run(["python", "-m", "edge_tts", "--voice", VOICE, "--rate=+15%", "--text", text, "--write-media", filepath], check=True)
    except Exception as e:
        print(f"Error generating {key}: {e}")

print("Done!")
