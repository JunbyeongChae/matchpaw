import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'matchpaw <onboarding@resend.dev>',
    to: email,
    subject: '[matchpaw] 비밀번호 재설정 안내',
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a1a; margin-bottom: 16px;">비밀번호 재설정</h2>
        <p style="color: #555; line-height: 1.6;">
          아래 버튼을 클릭하면 새 비밀번호를 설정할 수 있습니다.<br/>
          이 링크는 <strong>1시간</strong> 동안 유효합니다.
        </p>
        <a
          href="${resetUrl}"
          style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #e07b54; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;"
        >
          비밀번호 재설정하기
        </a>
        <p style="color: #999; font-size: 12px;">
          본인이 요청하지 않았다면 이 메일을 무시하세요.<br/>
          링크: ${resetUrl}
        </p>
      </div>
    `,
  });
}
