'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/localeStore';

export default function PrivacyPage() {
  const router = useRouter();
  const locale = useLocale((s) => s.locale);
  const isKo = locale === 'ko';

  return (
    <main className="min-h-screen bg-stone-950 text-stone-300 px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => router.push(`/${locale}/`)}
        className="text-stone-500 hover:text-stone-300 text-sm mb-6 transition-colors"
      >
        ← {isKo ? '홈으로 돌아가기' : 'Back to Home'}
      </button>

      <h1 className="text-2xl font-bold font-serif text-amber-400 mb-6">
        {isKo ? '개인정보처리방침' : 'Privacy Policy'}
      </h1>

      <section className="space-y-6 text-sm leading-relaxed text-stone-400">
        <p>
          {isKo
            ? 'Abyssos(이하 "본 게임")는 사용자의 개인정보 보호를 매우 중요하게 생각합니다. 본 방침은 본 게임에서 수집하는 정보와 그 사용 목적을 설명합니다.'
            : 'Abyssos ("the Game") values your privacy. This policy explains what information we collect and how we use it.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '1. 수집하지 않는 정보' : '1. Information We Do Not Collect'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 회원가입 없이 플레이할 수 있으며, 이름, 이메일 주소, 전화번호 등 어떠한 개인식별정보도 수집하지 않습니다.'
            : 'The Game does not require registration and does not collect any personally identifiable information such as name, email, or phone number.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '2. 로컬 저장소 (Local Storage)' : '2. Local Storage'}
        </h2>
        <p>
          {isKo
            ? '게임 진행 상태, 업적, 카드 컬렉션, 메타 업그레이드 진행도는 사용자의 브라우저 로컬 저장소(localStorage)에만 저장되며, 서버로 전송되지 않습니다. 이 데이터는 사용자가 직접 삭제하기 전까지 해당 브라우저에 남아 있습니다.'
            : 'Game progress, achievements, card collections, and meta-upgrade progress are stored only in your browser\'s localStorage and are never transmitted to our servers. This data remains on your device until you manually clear it.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '3. Google Analytics' : '3. Google Analytics'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 웹사이트 방문자 수와 페이지뷰를 분석하기 위해 Google Analytics를 사용합니다. Google Analytics는 익명화된 트래픽 데이터를 수집하며, 이 데이터는 Google의 개인정보처리방침에 따라 관리됩니다. 자세한 내용은 '
            : 'We use Google Analytics to analyze website traffic and page views. Google Analytics collects anonymized traffic data in accordance with Google\'s privacy policy. For more details, please visit '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 underline"
          >
            Google Privacy Policy
          </a>
          {isKo ? '를 참조하세요.' : '.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '4. Google AdSense' : '4. Google AdSense'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 Google AdSense를 통해 광고를 게재할 수 있습니다. Google AdSense는 쿠키를 사용하여 사용자의 방문 기록을 바탕으로 맞춤형 광고를 제공합니다. 사용자는 Google 광고 설정에서 맞춤형 광고를 비활성화할 수 있습니다.'
            : 'We may display ads through Google AdSense. Google AdSense uses cookies to serve personalized ads based on your visit history. You can opt out of personalized ads via '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 underline"
          >
            Google Ad Settings
          </a>
          {isKo ? '에서 맞춤형 광고를 끌 수 있습니다.' : '.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '5. 쿠키 (Cookies)' : '5. Cookies'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 직접적인 쿠키를 설정하지 않습니다. 단, Google Analytics 및 Google AdSense 서비스가 제3자 쿠키를 사용할 수 있습니다.'
            : 'The Game itself does not set cookies directly. However, third-party services such as Google Analytics and Google AdSense may use cookies.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '6. 문의처' : '6. Contact'}
        </h2>
        <p>
          {isKo
            ? '개인정보처리방침에 대한 문의는 아래 이메일로 연락 주세요.'
            : 'If you have any questions about this Privacy Policy, please contact us at:'}
          <br />
          <a
            href="mailto:core13773@gmail.com"
            className="text-amber-500 hover:text-amber-400 underline mt-1 inline-block"
          >
            core13773@gmail.com
          </a>
        </p>

        <p className="text-xs text-stone-600 mt-8">
          {isKo ? '최종 수정일: 2026년 6월 12일' : 'Last updated: June 12, 2026'}
        </p>
      </section>
    </main>
  );
}
