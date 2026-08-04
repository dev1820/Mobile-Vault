import { Logo } from "../components/brand/Logo";
import { ComplaintForm } from "../components/complaint/ComplaintForm";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER as string;
const INSTAGRAM_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE as string;
// Placeholder — replace with your real support email.
const SUPPORT_EMAIL = "support@mobilevault.pk";

type Block =
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "subheading"; text: string };

interface Section {
  number: number;
  title: string;
  blocks: Block[];
}

const SECTIONS: Section[] = [
  {
    number: 1,
    title: "General Terms",
    blocks: [
      {
        type: "list",
        items: [
          "Mobile Vault se purchase karte hi aap neeche diye gaye tamam terms and conditions ko accept karte hain.",
          "Mobile Vault ko yeh haq hasil hai ke woh kisi bhi waqt beghair pehle se bataye in terms ko update ya modify kar sake. Latest version hi har transaction par apply hogi.",
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Product Availability aur Pricing",
    blocks: [
      {
        type: "list",
        items: [
          "Tamam products first come, first served basis par sell hote hain aur availability ke mutabiq hote hain.",
          "Hum New / Box-Pack iPhones aur Used iPhones dono offer karte hain — PTA Approved, Non-PTA, Sim Locked aur Factory Unlock options ke sath. Har listing mein device ki condition aur status clearly mention kiya jata hai.",
          "Prices final aur non-negotiable hain jab tak kisi promotion ya special offer mein wazeh tor par kuch aur mention na kiya gaya ho.",
          "Agar kisi rare case mein stock discrepancy, technical error, ya listing mistake ho jaye, to Mobile Vault order cancel ya modify kar sakta hai. Agar payment receive ho chuki ho, to full refund diya jayega.",
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Orders, Booking aur Customer Details",
    blocks: [
      {
        type: "list",
        items: [
          "Orders sirf agreed advance/token receive hone ke baad confirm kiye jate hain.",
          "Phones sirf half advance payment par dispatch kiye jate hain.",
          "Accessories Cash on Delivery par sirf Rs. 350 advance ke baad bheji jati hain, aur yeh amount total bill mein se adjust ho jata hai. Misal ke taur par: Rs. 3500 - Rs. 350 = Rs. 3150 COD.",
          "Customer Rs. 5,000 non-refundable booking token de kar kisi device ko 5 din tak reserve kar sakta hai. Agar is muddat mein full payment complete na ho, to device dobara sale ke liye release ki ja sakti hai aur token refund nahi hoga.",
          "Token sirf duplication ki surat mein refund ya kisi doosray device mein adjust kiya jayega.",
          "Reels/Posts par duplicate tokens ki refund process 1 week tak le sakti hai, kyun ke yeh manual process hai aur time require karta hai.",
          "Reel/Post phones first come, first served basis par provide kiye jayenge.",
          "Order ID ke baghair koi bhi device dispatch nahi kiya jayega. Customer ke sath us ke device ka ek link share kiya jayega jisme woh apni address details khud fill karega. Parcel usi process ke complete hone ke baad dispatch hoga.",
          "Customer ke liye zaroori hai ke apna naam, contact aur shipping details bilkul sahi provide kare. Ghalat maloomat ki wajah se agar delay, failed delivery ya loss ho, to us ki zimmedari Mobile Vault par nahi hogi.",
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Payment Terms",
    blocks: [
      {
        type: "list",
        items: [
          "Accepted payment methods purchase ke waqt share kar diye jayenge.",
          "Order secure karne ke liye payment given timeframe ke andar complete karna zaroori hai. Agar payment time par receive na ho, to order cancel ho sakta hai aur reserved device dobara sale ke liye release ki ja sakti hai.",
          "Confusion ya delay se bachne ke liye customer ko hamesha payment proof share karna hoga.",
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Battery Health aur Anti-Boost Policy",
    blocks: [
      {
        type: "list",
        items: [
          "Battery health naturally degrade hone wali cheez hai aur waqt ke sath usage, charging cycles, temperature ya software recalibration ki wajah se kam ho sakti hai.",
          "Mobile Vault ki strict anti-boost policy hai — hum sirf unboosted, genuine batteries ke sath devices provide karte hain. Agar kisi device mein battery boost strip ya undisclosed battery tampering nikal aaye, aur yeh Team Mobile Vault ki verification se confirm ho jaye, to device replace kiya jayega.",
        ],
      },
      {
        type: "text",
        text: "Inspection sirf Team Mobile Vault ki taraf se ki jayegi, aur jahan zaroorat ho wahan live video call supervision ke sath customer ki mojoodgi mein ki ja sakti hai.",
      },
      {
        type: "text",
        text: "Agar battery boost strip ya undisclosed tampering mil jaye, to us ke badle similar condition aur value ka replacement device diya jayega.",
      },
      {
        type: "list",
        items: [
          "Kuch rare cases mein battery health ka achanak drop software recalibration ya pehle se ki gayi optimisation ki wajah se bhi ho sakta hai. Har sudden drop ka matlab boosted battery nahi hota.",
        ],
      },
      {
        type: "text",
        text: "Aisi surat mein Mobile Vault proper verification karega aur customer ko puri transparency di jayegi.",
      },
      {
        type: "text",
        text: "Agar customer ko phir bhi doubt ho, to device wapas bhej kar live video call supervision ke sath inspect kiya ja sakta hai.",
      },
      {
        type: "text",
        text: "Agar boosted battery ya koi unauthorized modification milti hai, to Mobile Vault device replace karega. Warna customer ko wazeh tasdeeq ke sath device wapas bhej diya jayega ke battery degradation natural thi.",
      },
      {
        type: "list",
        items: [
          "Note: Mobile Vault ki zimmedari yeh hai ke customer ko non-boosted device provide ki jaye. Delivery ke baad natural battery health degradation ki zimmedari hum par nahi hogi jab tak boosting ya undisclosed tampering prove na ho jaye.",
        ],
      },
    ],
  },
  {
    number: 6,
    title: "Shipping aur Delivery",
    blocks: [
      {
        type: "list",
        items: [
          "Hum nationwide shipping Pakistan ke andar provide karte hain — Secure Packaging aur Fast Delivery ke sath. Delivery time city aur courier service ke mutabiq vary kar sakta hai.",
          "Customer apni marzi ka courier choose kar sakta hai aur agar shipment insurance chahiye ho to pehle se bata sakta hai.",
          "Note: Courier insurance optional hai aur us ka kharcha customer khud bear karega.",
          "Parcel dispatch hone ke baad jab tak customer insurance nahi karwata, Mobile Vault courier ke loss, damage ya transit issue ka zimmedar nahi hoga.",
          "Agar customer insurance karwa leta hai, to loss ya transit issue ki surat mein Mobile Vault full refund provide karega.",
        ],
      },
      {
        type: "text",
        text: "Hum apne customers ko extra peace of mind ke liye hamesha insurance karwane ka mashwara dete hain.",
      },
    ],
  },
  {
    number: 7,
    title: "Warranty and Returns",
    blocks: [
      { type: "subheading", text: "7-Day Checking Warranty:" },
      {
        type: "text",
        text: "Mobile Vault devices par 7 din ki checking warranty deta hai jo genuine functional faults ke liye hoti hai.",
      },
      {
        type: "text",
        text: "Agar device mein genuine issue ho, to customer ko replacement diya jayega. Agar wohi device available na ho, to full refund diya jayega.",
      },
      {
        type: "text",
        text: "Change of mind ki surat mein high-ticket items (Above 20,000 PKR) jaise phones par Rs. 5,000 deduction apply hogi, aur return courier charges customer khud pay karega.",
      },
      {
        type: "text",
        text: "Mobile Vault ki strict anti-battery boost policy hai. Agar baad mein boosted battery prove ho jaye, to device replace kiya jayega. Jahan zaroorat ho, verification evidence ya video proof ke sath ki ja sakti hai.",
      },
      { type: "text", text: "Genuine fault ki surat mein return courier charges Mobile Vault pay karega." },
      {
        type: "text",
        text: "Agar purchased device available na ho, to returned item receive hone ke baad 2 working days ke andar full refund process kar diya jayega.",
      },
      { type: "subheading", text: "Accessories Warranty:" },
      {
        type: "text",
        text: "Mobile Vault se purchase ki gayi tamam accessories par 3 months functional warranty apply hogi.",
      },
      { type: "subheading", text: "Warranty in cheezon par apply nahi hogi:" },
      {
        type: "list",
        items: [
          "Physical ya accidental damage, misal ke taur par broken screen, dent ya nuksan",
          "Water ya moisture damage",
          "Tampering, third-party repairs, ya unauthorized modifications",
        ],
      },
    ],
  },
  {
    number: 8,
    title: "Dispute Resolution",
    blocks: [
      {
        type: "list",
        items: [
          "Kisi bhi dispute ya misunderstanding ki surat mein Mobile Vault formal complaint receive hone ke baad 4 working days ke andar matter resolve karne ki puri koshish karega.",
          "Customers se guzarish hai ke speedy resolution ke liye clear evidence, jaise videos, messages ya receipts, share karein.",
        ],
      },
    ],
  },
  {
    number: 9,
    title: "Product Condition",
    blocks: [
      {
        type: "list",
        items: [
          "Tamam devices apni stated condition ke mutabiq sell kiye jate hain — New/Box-Pack, Used, ya Refurbished — aur PTA Approved, Non-PTA, Sim Locked ya Factory Unlock status clearly mention kiya jata hai.",
          "Customers purchase se pehle tamam photos, descriptions aur verification details ghour se dekh lain. Delivery ke baad stated condition accepted samjhi jayegi, jab tak koi genuine undisclosed issue samne na aaye.",
        ],
      },
    ],
  },
  {
    number: 10,
    title: "Customer Responsibilities",
    blocks: [
      {
        type: "list",
        items: [
          "Customer ko khud ensure karna hoga ke purchased device us ki need aur use ke mutabiq hai.",
          "Improper use, software modification, ya unauthorized repair ki wajah se paida hone wale issues par warranty aur return eligibility khatam ho jayegi.",
          "Repair, exchange ya return se pehle customer ki zimmedari hai ke apna data backup kare aur iCloud ya Google lock remove kare.",
        ],
      },
    ],
  },
  {
    number: 11,
    title: "Privacy Policy",
    blocks: [
      {
        type: "list",
        items: [
          "Mobile Vault aap ki privacy aur security ko ahmiyat deta hai.",
          "Personal details, jaise naam, address aur contact number, sirf order processing ke liye collect ki jati hain aur beghair explicit consent ke third parties ke sath share nahi ki jati, siwaye un suratoun ke jahan order fulfill karna zaroori ho.",
          "Customer data service aur quality improve karne ke liye use kiya ja sakta hai.",
        ],
      },
    ],
  },
  {
    number: 12,
    title: "Limitation of Liability",
    blocks: [
      {
        type: "list",
        items: [
          "Mobile Vault kisi bhi purchased device ke use ya misuse ki wajah se hone wale indirect, incidental, ya consequential damages ka zimmedar nahi hoga.",
          "Har surat mein hamari total liability product ki original purchase price se zyada nahi hogi.",
        ],
      },
    ],
  },
  {
    number: 13,
    title: "Communication and Customer Behavior",
    blocks: [
      {
        type: "list",
        items: [
          "Order ke hawale se Mobile Vault sirf important aur zaroori updates share karega. Routine updates ke liye bar bar message karne ki zaroorat nahi hai, kyun ke koi bhi major progress, delay, ya required action hamari taraf se khud communicate kar diya jayega.",
          "Sunday ya kisi announced off day par calls, messages, ya order processing handle na bhi ki ja sake.",
          "Customers se tameez aur respect ke sath communication ki umeed ki jati hai. Bad-zabani, dhamki, ya staff ke sath ghalat rawaiye ki surat mein service refuse ki ja sakti hai.",
          "Repeated misconduct ki surat mein Mobile Vault permanently service deny kar sakta hai.",
        ],
      },
    ],
  },
  {
    number: 14,
    title: "Purchase / Repurchase Policy",
    blocks: [
      {
        type: "list",
        items: [
          "Mobile Vault devices purchase bhi karta hai, subject to condition, verification aur current market value.",
          "Device receive aur verify hone ke baad client ko payment transfer hone mein up to 48 hours lag sakte hain.",
          "Repurchase / Purchase rate us waqt ki current market value ke mutabiq hoga.",
          "Agar koi customer 7 din ke andar bina genuine issue ke product return karna chahe, to hum Rs. 5,000 non-refundable token deduction ke sath usay repurchase kar sakte hain.",
        ],
      },
      {
        type: "text",
        text: "Note: Market mein aam tor par returns par bohat zyada deduction hoti hai, lekin Mobile Vault fairness aur customer friendliness ko madde nazar rakhte hue isay minimum fixed deduction tak rakhta hai.",
      },
    ],
  },
];

function BlockView({ block }: { block: Block }) {
  if (block.type === "subheading") {
    return <p className="mt-4 font-semibold text-vault-white">{block.text}</p>;
  }
  if (block.type === "text") {
    return <p className="mt-3 text-sm leading-relaxed text-vault-silver">{block.text}</p>;
  }
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {block.items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-vault-silver">
          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-vault-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size="md" />
        <h1 className="font-display text-3xl font-semibold text-vault-white">Terms and Conditions</h1>
        <p className="text-sm uppercase tracking-widest text-vault-silver/60">Mobile Vault</p>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-vault-silver">
        Mobile Vault choose karne ka bohat shukriya. Hum aap ke trust aur support ki dil se qadar
        karte hain. Transparency maintain karne aur har customer ke liye smooth experience ensure
        karne ke liye, purchase karne se pehle yeh Terms and Conditions zaroor parh lain.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {SECTIONS.map((section) => (
          <div key={section.number}>
            <h2 className="font-display text-lg font-semibold text-vault-gold">
              {section.number}. {section.title}
            </h2>
            {section.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-vault-gold">15. Contact Information</h2>
        <p className="mt-3 text-sm text-vault-silver">For inquiries, complaints, ya assistance:</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          <li className="text-vault-silver">
            Instagram:{" "}
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noreferrer"
              className="text-vault-gold hover:underline"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </li>
          <li className="text-vault-silver">TikTok: @mobile.vault47</li>
          <li className="text-vault-silver">Website: www.mobilevault.pk</li>
          <li className="text-vault-silver">
            Email:{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-vault-gold hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </li>
          <li className="text-vault-silver">
            Call/WhatsApp:{" "}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-vault-gold hover:underline">
              {PHONE_NUMBER}
            </a>
          </li>
        </ul>
      </div>

      <p className="mt-8 text-sm italic leading-relaxed text-vault-silver/80">
        Hum aap ke trust ki qadar karte hain aur hamesha imaandari, reliability aur transparency ke
        sath aap ki service karne ki koshish karte rahenge.
      </p>

      <div className="mt-16 border-t border-vault-silver/10 pt-10">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-vault-white">Launch a Complaint</h2>
          <p className="mt-2 text-sm text-vault-silver">
            Fill the form below and make sure to text your ticket number on WhatsApp. Complaints may
            take up to 48 working hours to resolve.
          </p>
        </div>
        <div className="mt-8">
          <ComplaintForm />
        </div>
      </div>
    </div>
  );
}
