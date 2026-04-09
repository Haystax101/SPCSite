import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { usePostHog } from 'posthog-js/react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const TOTAL_STEPS = 5;

export default function WaitlistFlow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const posthog = usePostHog();
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState({
        email: '',
        name: '',
        jobTitle: '',
        company: '',
        usecase: '',
        usecaseText: '',
        referralCode: '',
        referredBy: ''
    });
    const [waitlistPosition, setWaitlistPosition] = useState<any>(null);
    const [loadingPhase, setLoadingPhase] = useState(0); // 0: inactive, 1: connecting, 2: preparing, 3: ready
    const [socialProof, setSocialProof] = useState<any>(null);
    const [, setBumpMessages] = useState<any>([]);

    const log = (...args: any[]) => {
        console.log('[WaitlistFlow]', ...args);
    };

    useEffect(() => {
        let toastInterval: any;
        let initialTimeout: any;

        log('effect start', {
            isOpen,
            pathname: window.location.pathname,
            search: window.location.search,
            currentStep,
            loadingPhase,
            hasPostHog: Boolean(posthog)
        });

        if (isOpen) {
            log('opening waitlist flow');
            posthog?.capture('waitlist_opened');
            const urlParams = new URLSearchParams(window.location.search);
            const refParam = urlParams.get('ref') || '';
            const genCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            log('derived open params', { refParam, genCode });

            if (refParam) {
                posthog?.capture('referred_user_joined', { referred_by: refParam });
            }

            document.body.style.overflow = 'hidden';
            log('body overflow locked');
            setCurrentStep(0);
            setData({ email: '', name: '', jobTitle: '', company: '', usecase: '', usecaseText: '', referralCode: genCode, referredBy: refParam });
            setWaitlistPosition(null);
            runLoadingSequence();

            // Fetch real referral data
            const loadRealToasts = async () => {
                log('loading referral toast data');
                const { data: dbData } = await supabase
                    .from('waitlist')
                    .select('name, referral_count')
                    .gt('referral_count', 0)
                    .limit(10);

                log('referral toast query result', {
                    count: dbData?.length ?? 0,
                    rows: dbData
                });

                if (dbData && dbData.length > 0) {
                    const mapped = dbData.map(u => {
                        const n = u.name ? u.name.split(' ')[0] : 'Someone';
                        if (u.referral_count >= 3) return `${n} just unlocked 1 month free!`;
                        return `${n} just moved up ${u.referral_count * 5} spots!`;
                    });
                    log('mapped referral toast messages', mapped);
                    setBumpMessages(mapped);
                } else {
                    log('no referral toast messages returned');
                }
            };
            loadRealToasts();

            const showToast = () => {
                setBumpMessages((currentMsgs: any) => {
                    log('showToast tick', { queuedMessages: currentMsgs.length });
                    if (currentMsgs.length > 0) {
                        const idx = Math.floor(Math.random() * currentMsgs.length);
                        const msg = currentMsgs[idx];
                        log('showToast selected message', { idx, msg });
                        setSocialProof(msg);
                        setTimeout(() => setSocialProof(null), 4000);

                        const newMsgs = [...currentMsgs];
                        newMsgs.splice(idx, 1);
                        if (newMsgs.length === 0 && toastInterval) {
                            log('showToast clearing interval because queue is empty');
                            clearInterval(toastInterval);
                        }
                        return newMsgs;
                    }
                    if (toastInterval) clearInterval(toastInterval);
                    log('showToast found no messages');
                    return currentMsgs;
                });
            };

            log('scheduling toast timers', { initialDelayMs: 3500, intervalMs: 10000 });
            initialTimeout = setTimeout(showToast, 3500);
            toastInterval = setInterval(() => {
                const roll = Math.random();
                log('toast interval tick', { roll });
                if (roll > 0.3) showToast();
            }, 10000);

        } else {
            log('closing waitlist flow, resetting transient state');
            document.body.style.overflow = '';
            setLoadingPhase(0);
            setSocialProof(null);
        }
        return () => {
            log('effect cleanup', { hasToastInterval: Boolean(toastInterval), hasInitialTimeout: Boolean(initialTimeout) });
            document.body.style.overflow = '';
            clearInterval(toastInterval);
            clearTimeout(initialTimeout);
        };
    }, [isOpen]);

    const runLoadingSequence = () => {
        log('loading sequence start');
        setLoadingPhase(1);
        setTimeout(() => {
            log('loading phase 2');
            setLoadingPhase(2);
        }, 800);
        setTimeout(() => {
            log('loading phase 3');
            setLoadingPhase(3);
        }, 1600);
        setTimeout(() => {
            log('loading finished, entering step 1');
            setLoadingPhase(0);
            setCurrentStep(1);
        }, 2200);
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 1: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
            case 2: return data.name.trim().length > 0;
            case 3: return data.jobTitle.trim().length > 0;
            case 4: return data.usecase.length > 0;
            case 5: return data.usecaseText.trim().length > 0;
            default: return false;
        }
    };

    const handleNext = async () => {
        log('handleNext invoked', { currentStep, data });
        if (isStepValid(currentStep)) {
            log('step valid, saving to Supabase', { currentStep });
            await saveToSupabase(data);

            if (currentStep === 1) {
                log('identifying PostHog user', { email: data.email });
                posthog?.identify(data.email);
            }

            posthog?.capture('waitlist_step_completed', {
                step: currentStep
            });

            log('captured waitlist_step_completed', { step: currentStep });

            const nextStep = currentStep < TOTAL_STEPS ? (prev: any) => prev + 1 : TOTAL_STEPS + 1;
            log('advancing step', { currentStep, nextStep });
            setCurrentStep(nextStep);

            if (nextStep === 6) {
                log('completion reached, capturing waitlist_completed and fetching position', { email: data.email });
                posthog?.capture('waitlist_completed');
                await fetchPosition(data.email);
            }
        } else {
            log('step invalid, not advancing', { currentStep, data });
        }
    };

    const fetchPosition = async (userEmail: string) => {
        try {
            log('fetchPosition start', { userEmail });
            const { data: dbData, error } = await supabase
                .from('waitlist')
                .select('position')
                .eq('email', userEmail)
                .single();

            log('fetchPosition result', { dbData, error });

            if (!error && dbData) {
                log('setting waitlist position from row', { position: dbData.position });
                setWaitlistPosition(dbData.position);
            } else {
                log('fetchPosition did not return a usable row', { userEmail, error, dbData });
            }
        } catch (err) {
            console.error('Failed to fetch position', err);
            log('fetchPosition threw', err);
        }
    };

    const saveToSupabase = async (currentData: any) => {
        if (!currentData.email) return;

        const payload: any = {
            email: currentData.email,
            referral_code: currentData.referralCode,
            referred_by: currentData.referredBy || null
        };
        if (currentData.name) payload.name = currentData.name;
        if (currentData.jobTitle) payload.job_title = currentData.jobTitle;
        if (currentData.company) payload.company = currentData.company;
        if (currentData.usecase) payload.use_case = currentData.usecase;
        if (currentData.usecaseText) payload.use_case_text = currentData.usecaseText;

        console.log('Sending payload to Supabase "waitlist" table:', payload);
        log('saveToSupabase start', { currentStep, payload });

        try {
            // Because Postgres RLS requires SELECT access to evaluate an ON CONFLICT upsert,
            // and the 'anon' policy does not grant SELECT, .upsert() will fail.
            // Instead, we explicitly INSERT on step 1, and UPDATE on steps 2 & 3.

            if (currentStep === 1) {
                // First step: Create the record. 
                log('saveToSupabase using insert');
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert(payload);

                log('insert result', { data, error });
                if (error) {
                    // If they refresh and enter the same email, it might throw a unique constraint error.
                    // We can safely ignore it and proceed because we will just UPDATE it on the next steps.
                    if (error.code === '23505') {
                        console.log('Email already exists in waitlist, proceeding to update mode for future steps.');
                        log('insert unique constraint hit, continuing', { code: error.code, message: error.message });
                    } else {
                        console.error('Supabase Insert Error:', error);
                        log('insert failed', error);
                        throw error;
                    }
                } else {
                    console.log('Supabase Insert Success:', data);
                    log('insert succeeded', data);
                }
            } else {
                // Steps 2 & 3: Update the existing record based on the email we saved in step 1.
                log('saveToSupabase using update', { email: currentData.email });
                const { data, error } = await supabase
                    .from('waitlist')
                    .update(payload)
                    .match({ email: currentData.email });

                log('update result', { data, error });
                if (error) {
                    console.error('Supabase Update Error:', error);
                    log('update failed', error);
                    throw error;
                }
                console.log('Supabase Update Success:', data);
                log('update succeeded', data);
            }
        } catch (error) {
            console.error('Failed to save to Supabase:', error);
            log('saveToSupabase threw', error);
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            log('enter pressed', { currentStep, value: e.target?.value });
            e.preventDefault();
            handleNext();
        }
    };

    if (!isOpen) return null;

    return (
        <div id="waitlist-flow" className="active" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="wf-topbar">
                <div className="wf-logo wf-logo-lg">
                    <svg width="16" height="21" viewBox="0 0 12 16" fill="none"><path d="M7 0L0 9h5l-1.5 7L12 7H7L7 0z" fill="#f5c842" /></svg>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: '19px', color: 'white', letterSpacing: '-0.01em', lineHeight: 1 }}>upercharged</span>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Close</button>
            </div>

            {currentStep > 0 && currentStep <= TOTAL_STEPS && (
                <div className="wf-step-progress-wrap active">
                    <div className="wf-step-progress-track">
                        <div className="wf-step-progress-fill" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}></div>
                    </div>
                    <div className="wf-step-progress-label">{currentStep} of {TOTAL_STEPS}</div>
                </div>
            )}

            {loadingPhase > 0 && (
                <div className="wf-loading active">
                    <div className="wf-logo" style={{ marginBottom: 0 }}>
                        <svg width="16" height="20" viewBox="0 0 12 16" fill="none"><path d="M7 0L0 9h5l-1.5 7L12 7H7L7 0z" fill="#f5c842" /></svg>
                        <span style={{ fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: '18px', color: 'white', letterSpacing: '-0.01em', lineHeight: 1 }}>upercharged</span>
                    </div>
                    <div className="wf-loading-bar-wrap">
                        <div className="wf-loading-bar" style={{ width: loadingPhase === 1 ? '30%' : loadingPhase === 2 ? '80%' : '100%', transition: 'width 0.8s ease' }}></div>
                    </div>
                    <div className="wf-loading-text" style={{ opacity: 1 }}>
                        {loadingPhase === 1 ? 'Connecting to Supercharged...' : loadingPhase === 2 ? 'Preparing your profile...' : 'Ready.'}
                    </div>
                </div>
            )}

            <div className="wf-body" style={{ display: loadingPhase === 0 ? 'flex' : 'none' }}>

                {currentStep === 1 && (
                    <div className="wf-step active visible">
                        <div className="wf-step-num">1</div>
                        <div className="wf-question">What's your email?</div>
                        <input autoFocus type="email" className="wf-input" placeholder="you@example.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} onKeyDown={handleKeyDown} />
                        <div className={`wf-btn-row ${isStepValid(1) ? 'show' : ''}`}>
                            <button className="wf-btn" onClick={handleNext}>Continue &rarr;</button>
                            <span className="wf-hint">press Enter &crarr;</span>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="wf-step active visible">
                        <div className="wf-step-num">2</div>
                        <div className="wf-question">What should we call you?</div>
                        <input autoFocus type="text" className="wf-input" placeholder="Your name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} onKeyDown={handleKeyDown} />
                        <div className={`wf-btn-row ${isStepValid(2) ? 'show' : ''}`}>
                            <button className="wf-btn" onClick={handleNext}>Continue &rarr;</button>
                            <span className="wf-hint">press Enter &crarr;</span>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="wf-step active visible">
                        <div className="wf-step-num">3</div>
                        <div className="wf-question">Tell us about yourself!</div>
                        <input autoFocus type="text" className="wf-input" placeholder="Position (e.g. Student, Founder, Analyst)" value={data.jobTitle} onChange={e => setData({ ...data, jobTitle: e.target.value })} onKeyDown={handleKeyDown} />
                        <input type="text" className="wf-input" placeholder="Organisation (e.g. LSE, Google, Self-employed)" value={data.company} onChange={e => setData({ ...data, company: e.target.value })} onKeyDown={handleKeyDown} />
                        <div className={`wf-btn-row ${isStepValid(3) ? 'show' : ''}`}>
                            <button className="wf-btn" onClick={handleNext}>Continue &rarr;</button>
                            <span className="wf-hint">press Enter &crarr;</span>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="wf-step active visible">
                        <div className="wf-step-num">4</div>
                        <div className="wf-question">Which feature on Supercharged would you use the most?</div>
                        <div className="wf-pills wf-pills-list">
                            {[
                                { id: 'A', text: 'AI people search' },
                                { id: 'B', text: 'Automated personalised outreach' },
                                { id: 'C', text: 'Priority inbox screening' },
                                { id: 'D', text: 'AI connection screening' },
                                { id: 'E', text: 'Daily curated match feed' }
                            ].map(pill => (
                                <div key={pill.id}
                                    className={`wf-pill-numbered ${data.usecase === pill.text ? 'selected' : ''}`}
                                    onClick={() => setData({ ...data, usecase: pill.text })}>
                                    <span className="wf-pill-letter">{pill.id}</span> {pill.text}
                                </div>
                            ))}
                        </div>
                        <div className={`wf-btn-row ${isStepValid(4) ? 'show' : ''}`}>
                            <button className="wf-btn" onClick={handleNext}>Continue &rarr;</button>
                        </div>
                    </div>
                )}

                {currentStep === 5 && (
                    <div className="wf-step active visible">
                        <div className="wf-step-num">5</div>
                        <div className="wf-question">What would you use Supercharged to do?</div>
                        <div className="wf-subtext">Tell us in your own words. The more specific, the better.</div>
                        <input autoFocus type="text" className="wf-input" placeholder="e.g. Find VCs investing in EdTech" value={data.usecaseText} onChange={e => setData({ ...data, usecaseText: e.target.value })} onKeyDown={handleKeyDown} />
                        <div className={`wf-btn-row ${isStepValid(5) ? 'show' : ''}`}>
                            <button className="wf-btn" onClick={handleNext}>Continue &rarr;</button>
                            <span className="wf-hint">press Enter &crarr;</span>
                        </div>
                    </div>
                )}

                {currentStep === 6 && (
                    <div className="wf-step active visible center" style={{ minHeight: '60vh' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <svg width="40" height="52" viewBox="0 0 12 16" fill="none"><path d="M7 0L0 9h5l-1.5 7L12 7H7L7 0z" fill="#f5c842" /></svg>
                        </div>
                        <div className="wf-confirm-head">We've secured your spot.</div>
                        <div className="wf-confirm-sub" style={{ fontSize: '20px', fontWeight: 600, marginTop: '8px', color: '#f5c842' }}>
                            You are #{waitlistPosition || '...'} on the waitlist.
                        </div>
                        <div className="wf-confirm-sub" style={{ marginTop: '16px' }}>We'll reach out to {data.name || 'you'} at {data.email || 'your email'} soon.</div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '12px', padding: '16px', marginTop: '24px', marginBottom: '24px' }}>
                            <div className="wf-confirm-sub2" style={{ color: '#fff', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.01em' }}>Move up 5 spots for every friend you invite.</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)', marginBottom: '12px' }}>Reach 3 referrals to unlock 1 month of free premium usage.</div>

                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', textAlign: 'left' }}>Your referral link</div>
                            <div className="referral-box" style={{ background: 'rgba(11, 18, 32, 0.88)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <code style={{ color: 'rgba(255,255,255,0.9)', flex: 1, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{'https://superchargedai.app/?ref='}{data.referralCode}</code>
                                <button onClick={() => { navigator.clipboard.writeText(`https://superchargedai.app/?ref=${data.referralCode}`); posthog?.capture('referral_link_copied'); alert('Copied!'); }} style={{ padding: '7px 12px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: '#0c1220', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Copy link</button>
                            </div>

                            <div className="wf-confirm-btns" style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just secured my spot on the Supercharged waitlist! AI-native networking that finds you the exact people you need to meet. Join me: https://superchargedai.app/?ref=" + data.referralCode)}`} target="_blank" rel="noreferrer" className="wf-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '50%', width: '38px', height: '38px', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => posthog?.capture('social_share_clicked', { network: 'X' })}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://superchargedai.app/?ref=" + data.referralCode)}`} target="_blank" rel="noreferrer" className="wf-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '50%', width: '38px', height: '38px', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => posthog?.capture('social_share_clicked', { network: 'LinkedIn' })}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                                <a href={`whatsapp://send?text=${encodeURIComponent("I just secured my spot on the Supercharged waitlist! Join me: https://superchargedai.app/?ref=" + data.referralCode)}`} className="wf-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '50%', width: '38px', height: '38px', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => posthog?.capture('social_share_clicked', { network: 'WhatsApp' })}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                                    </a>
                                </div>
                            </div>

                            <div className="wf-confirm-btns">
                                <button className="wf-btn" onClick={onClose} style={{ width: '100%' }}>Back to Supercharged</button>
                            </div>
                            <div className="wf-confirm-footer">&copy; 2026 Supercharged. All Rights Reserved.</div>
                        </div>
                    )}

                </div>

                {currentStep >= 1 && currentStep <= TOTAL_STEPS && (
                    <div className="wf-nav-arrows active" style={{ display: 'flex' }}>
                        <button className={`wf-arrow ${currentStep === 1 ? 'disabled' : ''}`} onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}>
                            <ArrowUp size={14} strokeWidth={2.5} color="#000" />
                        </button>
                        <button className="wf-arrow" onClick={handleNext}>
                            <ArrowDown size={14} strokeWidth={2.5} color="#000" />
                        </button>
                    </div>
                )}

                {socialProof && currentStep < 6 && (
                    <div style={{
                        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.95)', color: '#000', padding: '10px 16px',
                        borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 100,
                        display: 'flex', alignItems: 'center', gap: '8px',
                        whiteSpace: 'nowrap', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f5c842', boxShadow: '0 0 8px rgba(245,200,66,0.6)' }}></div> {socialProof}
                    </div>
                )}
            </div>
        );
    }
