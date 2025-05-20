import React, { useState } from 'react';
import { 
    MessageCircle, 
    Mail, 
    MapPin, 
    Send, 
    ArrowRight, 
    HelpCircle 
} from 'lucide-react';
import { useSelector } from 'react-redux';

function Support() {
    const isDarkMode = useSelector((state) => state.app.mode) === 'dark';
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Support form submitted:', formData);
        alert('Thank you! We will get back to you as soon as possible.');
    };

    return (
        <div className={`w-full h-full ${isDarkMode ? 'bg-[#20262E]' : 'bg-gray-100'} overflow-auto`}>
            <div className="mx-auto max-w-7xl px-4 py-5">
                <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-5 hidden md:block">
                    Support
                </h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Support Info Card */}
                    <div className={`${isDarkMode ? 'bg-slate-800 border-gray-800' : 'bg-white border-gray-200'} border shadow-xl rounded-xl overflow-hidden 
                        transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] 
                        hover:border-blue-500 group`}>
                        <div className={`p-4 flex items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <HelpCircle className="text-cyan-400 stroke-2" size={24} />
                            <h3 className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                                Customer Support
                            </h3>
                        </div>
                        <div className="p-4 overflow-auto max-h-[600px] space-y-4">
                            <div className="flex items-start">
                                <MessageCircle className="text-teal-400 mr-3 mt-1" size={20} />
                                <div className="text-left">
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Hotline</p>
                                    <p className="text-lg text-teal-400 font-semibold">1900 6868</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>24/7 Support</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="text-amber-400 mr-3 mt-1" size={20} />
                                <div className="text-left">
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Email</p>
                                    <p className="text-lg text-amber-400 font-semibold">support@photomanager.com</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Response within 24 hours</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="text-pink-400 mr-3 mt-1" size={20} />
                                <div className="text-left">
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Address</p>
                                    <p className="text-lg text-pink-400 font-semibold">5th Floor, Innovation Building</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Hanoi, Vietnam</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Form Card */}
                    <form 
                        onSubmit={handleSubmit}
                        className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border shadow-xl rounded-xl overflow-hidden 
                        transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] 
                        hover:border-blue-500 group`}
                    >
                        <div className={`p-4 flex items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                            <HelpCircle className="text-cyan-400 stroke-2" size={24} />
                            <h3 className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                                Submit a Support Request
                            </h3>
                        </div>
                        <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-auto max-h-[600px] space-y-4`}>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className={`w-full p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'} 
                                border rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300`}
                            />
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                required
                                className={`w-full p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'} 
                                border rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300`}
                            />
                            <select 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className={`w-full p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} 
                                border rounded-xl appearance-none focus:outline-none focus:border-cyan-500 transition-all duration-300`}
                            >
                                <option value="" className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Select support topic</option>
                                <option value="technical" className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Technical Support</option>
                                <option value="billing" className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Billing</option>
                                <option value="other" className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Other</option>
                            </select>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Support request details"
                                required
                                rows={6}
                                className={`w-full p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'} 
                                border rounded-xl resize-none focus:outline-none focus:border-cyan-500 transition-all duration-300`}
                            />
                            <button 
                                type="submit"
                                className="w-full bg-cyan-600 text-white p-3 rounded-xl 
                                hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 
                                transition-all duration-300 flex items-center justify-center group 
                                shadow-md hover:shadow-lg"
                            >
                                <Send className="mr-2 text-white" size={20} />
                                Submit Request
                                <ArrowRight 
                                    className="ml-2 opacity-0 group-hover:opacity-100 text-white 
                                    transition-all duration-300" 
                                    size={20} 
                                />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Support;