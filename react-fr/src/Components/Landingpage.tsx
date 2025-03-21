import { useState } from 'react';
import { Mail, MessageSquare, RefreshCw, Download, Settings, ChevronRight, Star, Shield, Zap } from 'lucide-react';
import { emailService, EmailGenerationData, EmailAnalysisData } from '../services/api.ts'
import ReactMarkdown from 'react-markdown';
import logo from "../assets/mail.png"
const LandingPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    // Form states
    const [emailData, setEmailData] = useState<EmailGenerationData>({
        purpose: '',
        recipient_info: '',
        sender_name: '',
        tone: 'formal',
        subject: '',
        key_points: '',
        context: '',
        actions: '',
        attachments: '',
        length: '',
    });

    const [replyData, setReplyData] = useState<EmailAnalysisData>({
        original_email: '',
        tone: 'professional',
        user_name: '',
        additional_context: '',
    });

    const [paraphraseData, setParaphraseData] = useState({
        text: '',
        tone: 'neutral',
    });

    const handleEmailGeneration = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!emailData.purpose || !emailData.recipient_info || !emailData.sender_name ||
                !emailData.tone || !emailData.subject || !emailData.key_points) {
                setError('Please fill in all required fields.');
                setLoading(false);
                return;
            }

            const response = await emailService.generateEmail(emailData);
            setResult(response.emailContent);
        } catch (err) {
            setError('Failed to generate email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReplyGeneration = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!replyData.original_email) {
                setError('Please paste the email you received.');
                setLoading(false);
                return;
            }

            const response = await emailService.analyzeAndReply(replyData);
            setResult(response.reply);
        } catch (err) {
            setError('Failed to generate reply. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleParaphrase = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await emailService.paraphraseText(paraphraseData.text, paraphraseData.tone);
            setResult(response.paraphrasedContent);
        } catch (err) {
            setError('Failed to paraphrase text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <Mail size={24} />,
            title: "Email Generator",
            description: "Create well-structured emails with customized tone, key points, and attachments.",
        },
        {
            icon: <MessageSquare size={24} />,
            title: "Email Reply Agent",
            description: "Analyze received emails, summarize them, and generate professional responses.",
        },
        {
            icon: <RefreshCw size={24} />,
            title: "Paraphraser",
            description: "Rewrite text in different tones including formal, friendly, concise, and creative.",
        },
        {
            icon: <Download size={24} />,
            title: "Export Options",
            description: "Download generated content as markdown files for easy access.",
        },
        {
            icon: <Settings size={24} />,
            title: "User Profiles",
            description: "Customize settings for personalized email responses.",
        }
    ];

    const benefits = [
        {
            icon: <Zap size={20} />,
            title: "Save Time",
            description: "Reduce email drafting time by up to 70%"
        },
        {
            icon: <Star size={20} />,
            title: "Professional Quality",
            description: "Always send polished, error-free emails"
        },
        {
            icon: <Shield size={20} />,
            title: "Secure & Private",
            description: "Your data stays protected, no emails stored"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-700 to-purple-900 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-700 to-blue-900 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="px-6 py-4 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <img src={logo} alt="Logo" height={40} width={40} />
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Gen-a-email</h1>
                    </div>
                    <nav className="mb-4 md:mb-0 w-full md:w-auto">
                        <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
                            <li><a href="#features" className="text-gray-300 hover:text-white transition">Features</a></li>
                            <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a></li>
                            <li><a href="#installation" className="text-gray-300 hover:text-white transition">Installation</a></li>
                        </ul>
                    </nav>
                   <a href='#emailapp'> <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:opacity-90 transition font-medium w-full md:w-auto">Get Started</button>
                   </a>   </header>

                {/* Hero Section */}
                <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Email Writing Simplified with AI
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                        Generate professional emails, craft perfect replies, and paraphrase content in seconds with our Gemini AI-powered tool.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
                       <a href='#emailapp'> <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:opacity-90 transition font-medium text-lg">
                            Try Gen-a-email Free
                        </button></a>
                    </div>

                    {/* App preview */}
                    <div id="emailapp" className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl max-w-4xl mx-auto">
                        <div className="flex gap-4 mb-4 border-b border-gray-700 pb-4">
                            {["Email Generator", "Email Reply", "Paraphraser"].map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`px-4 py-2 rounded-md ${activeTab === index ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {activeTab === 0 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Purpose</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.purpose}
                                            onChange={(e) => setEmailData({ ...emailData, purpose: e.target.value })}
                                            placeholder="Enter email purpose"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Recipient Info</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.recipient_info}
                                            onChange={(e) => setEmailData({ ...emailData, recipient_info: e.target.value })}
                                            placeholder="Enter recipient information"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.sender_name}
                                            onChange={(e) => setEmailData({ ...emailData, sender_name: e.target.value })}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.subject}
                                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                            placeholder="Enter email subject"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Key Points</label>
                                        <textarea
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                            value={emailData.key_points}
                                            onChange={(e) => setEmailData({ ...emailData, key_points: e.target.value })}
                                            placeholder="Enter key points for your email"
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Tone</label>
                                        <select
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.tone}
                                            onChange={(e) => setEmailData({ ...emailData, tone: e.target.value })}
                                        >
                                            <option value="formal">Formal</option>
                                            <option value="friendly">Friendly</option>
                                            <option value="concise">Concise</option>
                                            <option value="creative">Creative</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Context (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.context}
                                            onChange={(e) => setEmailData({ ...emailData, context: e.target.value })}
                                            placeholder="Background information"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Actions Required (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.actions}
                                            onChange={(e) => setEmailData({ ...emailData, actions: e.target.value })}
                                            placeholder="e.g. Please confirm by..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Attachments (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.attachments}
                                            onChange={(e) => setEmailData({ ...emailData, attachments: e.target.value })}
                                            placeholder="e.g. file1.pdf, file2.docx"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Desired Length (Optional)</label>
                                        <select
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={emailData.length}
                                            onChange={(e) => setEmailData({ ...emailData, length: e.target.value })}
                                        >
                                            <option value="">Select Length</option>
                                            <option value="short">Short</option>
                                            <option value="medium">Medium</option>
                                            <option value="long">Long</option>
                                        </select>
                                    </div>
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:opacity-90 transition font-medium"
                                        onClick={handleEmailGeneration}
                                        disabled={loading}
                                    >
                                        {loading ? 'Generating...' : 'Generate Email'}
                                    </button>
                                </div>
                            )}
                            {activeTab === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Email to Respond To</label>
                                        <textarea
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                            value={replyData.original_email}
                                            onChange={(e) => setReplyData({ ...replyData, original_email: e.target.value })}
                                            placeholder="Paste the email you received"
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={replyData.user_name}
                                            onChange={(e) => setReplyData({ ...replyData, user_name: e.target.value })}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Response Tone</label>
                                        <select
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={replyData.tone}
                                            onChange={(e) => setReplyData({ ...replyData, tone: e.target.value })}
                                        >
                                            <option value="professional">Professional</option>
                                            <option value="friendly">Friendly</option>
                                            <option value="concise">Concise</option>
                                            <option value="detailed">Detailed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Additional Context (Optional)</label>
                                        <textarea
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                                            value={replyData.additional_context}
                                            onChange={(e) => setReplyData({ ...replyData, additional_context: e.target.value })}
                                            placeholder="Additional information to include in your reply, e.g., Mention the updated project timeline"
                                        ></textarea>
                                    </div>
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:opacity-90 transition font-medium"
                                        onClick={handleReplyGeneration}
                                        disabled={loading}
                                    >
                                        {loading ? 'Generating...' : 'Generate Reply'}
                                    </button>
                                </div>
                            )}
                            {activeTab === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Text to Paraphrase</label>
                                        <textarea
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                            value={paraphraseData.text}
                                            onChange={(e) => setParaphraseData({ ...paraphraseData, text: e.target.value })}
                                            placeholder="Enter text to paraphrase"
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-300 text-sm">Target Tone</label>
                                        <select
                                            className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={paraphraseData.tone}
                                            onChange={(e) => setParaphraseData({ ...paraphraseData, tone: e.target.value })}
                                        >
                                            <option value="neutral">Neutral</option>
                                            <option value="formal">Formal</option>
                                            <option value="casual">Casual</option>
                                            <option value="persuasive">Persuasive</option>
                                            <option value="creative">Creative</option>
                                        </select>
                                    </div>
                                    <button
                                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:opacity-90 transition font-medium"
                                        onClick={handleParaphrase}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Paraphrase Text'}
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-md text-red-400">
                                    {error}
                                </div>
                            )}

                            {result && (
                                <div className="mt-4 p-4 bg-gray-700 rounded-md">
                                    <h3 className="text-lg font-semibold mb-2">Generated Content:</h3>
                                    <div className="whitespace-pre-wrap text-gray-200 bg-gray-800 p-3 rounded border border-gray-600 overflow-auto max-h-96">
                                        <ReactMarkdown>{result}</ReactMarkdown>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium flex items-center"
                                            onClick={() => {
                                                const element = document.createElement("a");
                                                const file = new Blob([result || ""], { type: 'text/markdown' });
                                                element.href = URL.createObjectURL(file);
                                                element.download = `generated_content_${new Date().toISOString().slice(0, 10)}.md`;
                                                document.body.appendChild(element);
                                                element.click();
                                                document.body.removeChild(element);
                                            }}
                                        >
                                            <Download size={16} className="mr-2" /> Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Key Features</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                                <div className="text-blue-400 mb-4 p-3 bg-gray-700 rounded-lg inline-block">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section className="px-6 py-16 bg-gray-800 relative">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Why Choose Gen-a-email?</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-purple-500 transition-all duration-300">
                                    <div className="text-purple-400 mb-4 p-3 bg-gray-600 rounded-lg inline-block">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                                    <p className="text-gray-300">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="px-6 py-16 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">How It Works</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 relative">
                            <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">1</div>
                            <div className="pt-12">
                                <h3 className="text-xl font-semibold mb-2">Fill in details</h3>
                                <p className="text-gray-300">Choose your email type, enter your requirements, and select your preferred tone.</p>
                            </div>
                        </div>
                        <div className="p-6 relative">
                            <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">2</div>
                            <div className="pt-12">
                                <h3 className="text-xl font-semibold mb-2">AI Generation</h3>
                                <p className="text-gray-300">Our Gemini AI analyzes your input and generates perfectly crafted content.</p>
                            </div>
                        </div>
                        <div className="p-6 relative">
                            <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">3</div>
                            <div className="pt-12">
                                <h3 className="text-xl font-semibold mb-2">Use or Edit</h3>
                                <p className="text-gray-300">Download your content, make any changes, or use it directly in your favorite email client.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Installation */}
                <section id="installation" className="px-6 py-16 bg-gray-800 relative">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Get Started in Minutes</span>
                        </h2>
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">1. Clone the repository</h3>
                                    <div className="bg-gray-800 p-4 rounded-md">
                                        <code className="text-blue-400">git clone https://github.com/ayazmirza54/gen-email-agent-ai.git</code>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">2. Install dependencies</h3>
                                    <div className="bg-gray-800 p-4 rounded-md">
                                        <code className="text-blue-400">pip install -r requirements.txt</code>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">3. Set up API key</h3>
                                    <div className="bg-gray-800 p-4 rounded-md">
                                        <code className="text-blue-400">export GEMINI_API_KEY="your_api_key"</code>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">4. Run the application</h3>
                                    <div className="bg-gray-800 p-4 rounded-md">
                                        <code className="text-blue-400">streamlit run app.py</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-16 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to transform your email workflow?</h2>
                    <p className="text-xl text-gray-300 mb-10">Join thousands of professionals who are saving time and writing better emails with Gen-a-email.</p>
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:opacity-90 transition font-medium text-lg">
                        Get Started For Free <ChevronRight className="inline ml-2" size={18} />
                    </button>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 px-6 py-12 border-t border-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <Mail className="text-blue-400" size={24} />
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Gen-a-email</h2>
                            </div>
                            <nav className="w-full md:w-auto">
                                <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
                                    <li><a href="#features" className="text-gray-300 hover:text-white transition">Features</a></li>
                                    <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a></li>
                                    <li><a href="#installation" className="text-gray-300 hover:text-white transition">Installation</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="text-center text-gray-400 text-sm">
                            © {new Date().getFullYear()} Gen-a-email. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;