'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/localeStore';

export default function ContactPage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);
  const isKo = locale === 'ko';

  const card = 'bg-stone-900/60 border border-stone-800 rounded-xl p-5';

  return (
    <main className="min-h-screen bg-stone-950 text-stone-300 px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => router.push(`/${locale}/`)}
        className="text-stone-500 hover:text-stone-300 text-sm mb-6 transition-colors"
      >
        ← {isKo ? '홈으로 돌아가기' : 'Back to Home'}
      </button>

      <h1 className="text-2xl font-bold font-serif text-amber-400 mb-3">
        {isKo ? '문의하기' : 'Contact Us'}
      </h1>
      <p className="text-sm text-stone-400 mb-6">
        {isKo
          ? '버그 신고, 기능 제안, 협업 문의 등 어떤 내용이든 환영합니다.'
          : 'Bug reports, feature suggestions, and collaboration inquiries are all welcome.'}
      </p>

      <div className="space-y-4">
        <div className={card}>
          <h2 className="text-base font-bold text-stone-200 mb-1">
            {isKo ? '이메일' : 'Email'}
          </h2>
          <p className="text-sm text-stone-400 mb-2">
            {isKo ? '일반 문의 및 지원:' : 'For general inquiries and support:'}
          </p>
          <a
            href="mailto:core13773@gmail.com"
            className="text-amber-500 hover:text-amber-400 underline"
          >
            core13773@gmail.com
          </a>
        </div>

        <div className={card}>
          <h2 className="text-base font-bold text-stone-200 mb-1">
            {isKo ? '응답 시간' : 'Response Time'}
          </h2>
          <p className="text-sm text-stone-400">
            {isKo
              ? '소규모 팀으로 운영되며, 영업일 기준 2~3일 이내에 답변드리려 노력합니다.'
              : 'We are a small team and aim to respond within 2–3 business days.'}
          </p>
        </div>

        <div className={card}>
          <h2 className="text-base font-bold text-stone-200 mb-1">
            {isKo ? '관련 문서' : 'Related Documents'}
          </h2>
          <p className="text-sm text-stone-400">
            <a href={`/${locale}/privacy/`} className="text-amber-500 hover:text-amber-400 underline mr-3">
              {isKo ? '개인정보처리방침' : 'Privacy Policy'}
            </a>
            <a href={`/${locale}/terms/`} className="text-amber-500 hover:text-amber-400 underline">
              {isKo ? '이용약관' : 'Terms of Service'}
            </a>
          </p>
        </div>
      </div>

      <p className="text-xs text-stone-600 mt-8">
        {isKo ? '© 2026 Abyssos.' : '© 2026 Abyssos.'}
      </p>
    </main>
  );
}
