'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/localeStore';

export default function TermsPage() {
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
        {isKo ? '이용약관' : 'Terms of Service'}
      </h1>

      <section className="space-y-6 text-sm leading-relaxed text-stone-400">
        <p>
          {isKo
            ? '본 이용약관(이하 "약관")은 Abyssos(이하 "본 게임")의 사용 조건을 규정합니다. 본 게임에 접속하거나 플레이함으로써 귀하는 본 약관에 동의하는 것으로 간주됩니다.'
            : 'These Terms of Service (the "Terms") govern your use of Abyssos (the "Game"). By accessing or playing the Game, you agree to be bound by these Terms.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '1. 이용 허가' : '1. License to Use'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 무료이며, 개인적·비상업적 목적으로 자유롭게 플레이할 수 있습니다. 모든 게임 데이터는 귀하의 브라우저 로컬 저장소에만 저장됩니다.'
            : 'The Game is free to play for personal, non-commercial use. All game data is stored only in your browser\'s local storage.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '2. 콘텐츠 저작권' : '2. Intellectual Property'}
        </h2>
        <p>
          {isKo
            ? '본 게임의 디자인, 아트워크, 텍스트, 코드 등 모든 콘텐츠의 저작권은 Abyssos에 있으며, 무단 복제·배포를 금합니다.'
            : 'All content in the Game — including design, artwork, text, and code — is owned by Abyssos. Unauthorized reproduction or distribution is prohibited.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '3. 보증의 부인' : '3. Disclaimer of Warranty'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 "있는 그대로" 제공되며, 오류가 없거나 항상 접근 가능함을 보장하지 않습니다. 게임 사용으로 인해 발생하는 데이터 손실 등의 책임은 사용자에게 있습니다.'
            : 'The Game is provided "as is" without warranties of any kind. We do not guarantee it will be error-free or always accessible. You are responsible for any data loss resulting from use of the Game.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '4. 광고' : '4. Advertising'}
        </h2>
        <p>
          {isKo
            ? '본 게임은 HilltopAds 등 제3자 광고 네트워크를 통해 광고를 게재할 수 있습니다. 광고 콘텐츠에 대해서는 책임지지 않습니다.'
            : 'The Game may display advertisements through third-party networks such as HilltopAds. We are not responsible for the content of advertisements.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '5. 약관의 변경' : '5. Changes to These Terms'}
        </h2>
        <p>
          {isKo
            ? '약관은 수시로 변경될 수 있으며, 변경 후에도 게임을 계속 사용하면 개정된 약관에 동의한 것으로 간주됩니다.'
            : 'These Terms may be updated from time to time. Continued use of the Game after changes constitutes acceptance of the revised Terms.'}
        </p>

        <h2 className="text-lg font-bold text-stone-300 mt-4">
          {isKo ? '6. 문의처' : '6. Contact'}
        </h2>
        <p>
          {isKo
            ? '약관에 대한 문의는 아래 이메일로 연락 주세요.'
            : 'If you have any questions about these Terms, please contact us at:'}
          <br />
          <a
            href="mailto:core13773@gmail.com"
            className="text-amber-500 hover:text-amber-400 underline mt-1 inline-block"
          >
            core13773@gmail.com
          </a>
        </p>

        <p className="text-xs text-stone-600 mt-8">
          {isKo ? '최종 수정일: 2026년 6월 21일' : 'Last updated: June 21, 2026'}
        </p>
      </section>
    </main>
  );
}
