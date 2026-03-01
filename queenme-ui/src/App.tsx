import { useState , useRef, useEffect, type KeyboardEvent } from "react";
// use state is like local parameter that can be updated and will cause the component to re-render when it changes
// use ref is like a way to reference a DOM element (like the input box or the bottom of the chat) so we can interact with it directly (like focusing the input or scrolling to the bottom)
// use effect is a way to run some code in response to changes in state or props (like scrolling to the bottom whenever messages change or loading state changes)
// Key board is a typescript type for keyboard events like clicking enter in the input box so we can handle that and trigger the askBot function

//==================Types=========================

interface Message {// this is like class in oop it defines the structure of a message object that we will use to represent each chat message in our app.  a role (either user or bot)
  id:string;
  role: "user" |"bot";
  text:string;
  timestamp: Date;
}

//==================Constants=====================

const SUGGESTIONS =[ // a list of strings as example questions that user can click on to ask
  "What faculties does Queen's have?",
  "What faculties offers Artificial Intelligence related courses?",
  "What are the admission requirements for international students?",
  "How do i apply to Queen's University?",
];

//=================SVG Icons======================

const CrownIcon =() =>(
  // svg element like a paper you can stretch has a view box starting at 0,0 and is 24 x24 units in size that scales to the size in className (w-5 h-5 means width and height of 20px) and fills with current color (which will be set by the parent element's text color)
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">  
    <path d="M2 19h20v2H2v-2z m2-3 l-3-8 8 4 3 -5 3 5 8 -4 -3 8 H4z m8-10a2 2 0 1 0 0 -4 a2 2 0 0 0 0 4 z"/>// draws a crown
  </svg>
)
//user icon
const UserIcon =() =>(
  // svg element like a paper you can stretch has a view box starting at 0,0 and is 24 x24 units in size that scales to the size in className (w-5 h-5 means width and height of 20px) and fills with current color (which will be set by the parent element's text color)
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">  
     <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/>
    </svg>
)
//send icon
const SendIcon =()=> (
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
//=================UI Components====================

// Typing dots

const TypingDots =() =>(
  <div className ="flex items-center gap-1 px-4 py -3">
    {[0,1,2,3].map((i)=>(
      <span key ={i} className="w-2 h-2 rounded-full bg-queens-gold" style={{animation: `bounce 1.2s ease-in-out ${i*0.3}s infinite`}}/>// 4 dots that bounces up and down every 0 , 0.3 , 0.6 , 0.9 s
    ))}
    </div>
);
//================Message Bubble Component===========

const MessageBubble =({msg}:{msg:Message}) =>{ // a component that takes a message object as prop and renders a chat bubble with the message text and timestamp.  it also styles differently if the message is from the bot or the user (bot messages are aligned left with a crown avatar, user messages are aligned right with a Y avatar)
  const isBot = msg.role === "bot";// prop msg that is passed in as argument to component
  const time = msg.timestamp.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}); // formats the timestamp to show only hours and minutes

  return(
    <div className ={`flex items-end gap-3 ${isBot ? "justify-start" : "justify-end"}`} style={{animation:"slideUp 0.3s ease-out"}}>
      {/*only render if it is a Bot msg*/}
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-queens-red flex items-center justify-center flex-shrink-0 border-2 border-queens-gold shadow-md">
          <span className="text-queens-gold text-xs">
            <CrownIcon/>
          </span>
        </div>    
      )}
     { /* the chat bubble container that holds the message text and timestamp.  it is aligned left for bot messages and right for user messages.  it also has a max width of 75% of the chat area to prevent it from being too wide.  the message text is styled differently for bot and user messages (bot messages have a white background with gray text, user messages have a blue background with white text) and they also have different border radius to create a speech bubble effect (bot messages have a rounded top left corner, user messages have a rounded top right corner)*/}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isBot ? "items-start" : "items-end"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isBot ? "bg-white text-gray-800 rounded-tl-sm border border-gray-100" : "bg-queens-blue text-white rounded-tr-sm"}`} style={{fontFamily:"'Source Serif 4', Georgia, serif"}} >
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{time}</span>
      </div>
      {/*only render if it is a user msg*/}
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-queens-red flex items-center justify-center flex-shrink-0 shadow-md text-white text-xs font-bold">
          <UserIcon/>
        </div>
      )}
    </div>

  );
};

//=================The Main APP compponent====================
export default function App()
{
  const [messages, setMessages ] = useState<Message[]>([ // state variable that holds an array of message objects.  it is initialized with a welcome message from the bot
    {
      id:"Welcome",
      role:"bot",
      text:"Welcome to Queens University ! I'm QueenMe Bot, your admission assistant. I can help you with information about undergraduate and postgraduate programs, application process, and more. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [question, setQuestion] = useState(""); // state variable that holds the current question that the user is typing in the input box
  const [isLoading, setIsLoading] = useState(false); // state variable that indicates whether we are waiting for a response from the bot.  it is used to disable the input and show the typing indicator
  const bottomRef = useRef<HTMLDivElement>(null); // ref variable that references the bottom of the chat messages.  it is used to scroll to the bottom whenever a new message is added or when loading state changes
  const inputRef = useRef<HTMLInputElement>(null); // ref variable that references the input box.  it is used to focus the input box after sending a message or receiving a response
    
  useEffect(() =>{
  bottomRef.current?.scrollIntoView({behavior:"smooth"}); // whenever messages or loading state changes, scroll to the bottom of the chat smoothly
  },[messages,isLoading])
  const askBot = async (q:string) =>{
    const text = q.trim(); // remove whitespace from the question
    if(!text || isLoading) return;
    const userMsg:Message = {
      id: Date.now().toString(),
      role:"user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsLoading(true);
    try{
      const res = await fetch("http://127.0.0.1:8000/ask",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({question:text}),
      });
      const data = await res.json();
      const botMsg:Message = {
        id:(Date.now() +1).toString(),
        role:"bot",
        text: data.answer ?? "Un available infromation. Please visit queensu.ca for more information.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }catch{
      setMessages((prev) =>[
        ...prev,
        {
          id:(Date.now() +1).toString(),
          role:"bot",
          text:"Unable to reach the server.",
          timestamp: new Date(),
    },]);
      
    }
    finally{
      setIsLoading(false);
      inputRef.current?.focus();
    
    }
  };
  const handleKey =(e:KeyboardEvent<HTMLInputElement>) =>{
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      askBot(question);
    }
  };

  return (
    <>
      {/* ──   Queens university styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500;600&family=Source+Serif+4:wght@400;500&display=swap');

        :root {
          --queens-blue: #002452;
          --queens-gold: #F9CE1D;
          --queens-red:  #9D1939;
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Source Sans 3', sans-serif;
          background: linear-gradient(135deg, #001530 0%, #0a2952 60%, #6b1128 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          
        }

        .queens-blue  { color: var(--queens-blue); }
        .queens-gold  { color: var(--queens-gold); }
        .queens-red   { color: var(--queens-red); }
        .bg-queens-blue { background-color: var(--queens-blue); }
        .bg-queens-gold { background-color: var(--queens-gold); }
        .bg-queens-red  { background-color: var(--queens-red); }
        .border-queens-gold { border-color: var(--queens-gold); }
        .text-queens-gold { color: var(--queens-gold); }
        .text-queens-blue { color: var(--queens-blue); }
        .text-queens-red  { color: var(--queens-red); }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .chat-shell {
          animation: fadeIn 0.5s cubic-bezier(.22,1,.36,1) both;
        }

        .messages-scroll::-webkit-scrollbar { width: 4px; }
        .messages-scroll::-webkit-scrollbar-track { background: transparent; }
        .messages-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }

        .send-btn {
          background: var(--queens-blue);
          transition: all 0.2s ease;
        }
        .send-btn:hover:not(:disabled) {
          background: #003070;
          transform: scale(1.05);
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .suggestion-chip {
          transition: all 0.18s ease;
          border: 1px solid rgba(0,36,82,0.15);
        }
        .suggestion-chip:hover {
          background: var(--queens-blue);
          color: white;
          border-color: var(--queens-blue);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,36,82,0.2);
        }

        .input-ring:focus-within {
          box-shadow: 0 0 0 3px rgba(249,206,29,0.35);
        }
      `}</style>

      {/* ── Shell ── */}
      <div
        className="chat-shell flex flex-col bg-white overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 780,
          height: "95vh",
          maxHeight: 860,
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {/* ── Header ── */}
        <header
          className="bg-queens-blue flex-shrink-0 relative overflow-hidden"
          style={{ borderBottom: "3px solid var(--queens-gold)" }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", right: -40, top: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(249,206,29,0.05)", pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute", right: 60, top: 20,
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(157,25,57,0.08)", pointerEvents: "none"
          }} />

          <div className="flex items-center gap-4 px-6 py-4">
            {/* Logo mark */}
            <div
              className="flex-shrink-0 flex items-center  justify-center rounded-full text-queens-gold"
              style={{
                width: 40, height: 40,
                background: "#9D1939",
                border: "#F9CE1D 2px solid",
                boxShadow: "0 0 20px rgba(249,206,29,0.15)",
              }}
            >
              <CrownIcon />
            </div>

            {/* Title */}
            <div className="flex-1">
              <h1
                className="text-white text-xl font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                QueenMe Bot
              </h1>
              <p
                className="text-queens-gold text-xs font-medium tracking-widest uppercase mt-0.5"
                style={{ opacity: 0.9 }}
              >
                Queen's University · Website Assistant
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
                style={{ boxShadow: "0 0 0 3px rgba(74,222,128,0.2)", animation: "bounce 2s infinite" }}
              />
              <span className="text-green-400 text-xs font-medium">Online</span>
            </div>
          </div>

          {/* Tricolour stripe */}
          <div style={{
            height: 3,
            background: "linear-gradient(90deg, var(--queens-blue) 33%, var(--queens-red) 33% 66%, var(--queens-gold) 66%)"
          }} />
        </header>

        {/* ── Messages ── */}
        <div
          className="messages-scroll flex-1 overflow-y-auto flex flex-col gap-4 p-6"
          style={{ background: "#f8f9fb" }}
        >
          {/* Date stamp */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-3" style={{ animation: "slideUp 0.3s ease-out" }}>
              <div
                className="w-8 h-8 rounded-full bg-queens-blue flex items-center justify-center flex-shrink-0 border-2 border-queens-gold shadow-md"
              >
                <span className="text-queens-gold"><CrownIcon /></span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Suggestions ── */}
        {messages.length <= 1 && (
          <div className="flex-shrink-0 px-6 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => askBot(s)}
                className="suggestion-chip px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-white cursor-pointer"
                style={{ fontFamily: "'Source Sans 3', sans-serif" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── Input bar ── */}
        <div
          className="flex-shrink-0 px-5 py-4 bg-white"
          style={{ borderTop: "1px solid #e9ecf0" }}
        >
          <div
            className="input-ring flex items-center gap-3 bg-gray-50 rounded-2xl px-4 transition-all duration-200"
            style={{ border: "1.5px solid #dde1e7" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about admissions, programs, scholarships…"
              disabled={isLoading}
              className="flex-1 bg-transparent py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            />
            <button
              onClick={() => askBot(question)}
              disabled={!question.trim() || isLoading}
              className="send-btn w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>

          {/* Footer note */}
          <p className="text-center text-[10px] text-gray-400 mt-2.5 tracking-wide">
            Disclaimer All rights reserved.Powered by Queen's University RAG · For official info visit{" "}
            <a href="https://queensu.ca" target="_blank" rel="noreferrer" className="underline text-queens-blue" style={{ color: "var(--queens-blue)" }}>
              queensu.ca
            </a>
          </p>
        </div>
      </div>
    </>
  );
}