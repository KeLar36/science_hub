import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
			await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
			toast.success("Інструкції надіслано на вашу пошту!");
		} catch (err) {
			toast.error(err.response?.data?.error || "Помилка");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
			<Toaster position="top-center" />
			<Navbar />
			<main className="flex-grow flex items-center justify-center px-6 mt-50 mb-50">
				<div className="max-w-md w-full bg-[var(--bg-card)] rounded-[48px] p-10 border border-[var(--border-color)] shadow-2xl">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-black text-[var(--text-dark)]">Відновити пароль</h2>
						<p className="text-[var(--text-gray)] text-sm mt-2">Введіть email, на який ми надішлемо посилання</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-1 group">
							<label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-4">Email</label>
							<div className="relative">
								<Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50" size={18} />
								<input
									className="w-full pl-14 pr-6 py-4.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl outline-none focus:border-[#6d28d9] transition-all font-bold"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>

						<button
							disabled={loading}
							className="w-full py-5 bg-[#6d28d9] text-white rounded-[24px] font-black hover:bg-[#5b21b6] transition-all flex items-center justify-center gap-2"
						>
							{loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Надіслати</>}
						</button>

						<Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--text-gray)] hover:text-[#6d28d9] transition-colors">
							<ArrowLeft size={16} /> Повернутися до входу
						</Link>
					</form>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ForgotPassword;