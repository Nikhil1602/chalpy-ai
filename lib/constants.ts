import { AIModelConfig, LauncherConfig, ThemeConfig } from "@/types";

export const htmlTemplate = (templateDetails: { title: string, description: string, link: string, name: string, linkText: string }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:20px;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <tr>
        <td style="background-color:#f97316;padding:30px 20px;text-align:center;">
          <img src="https://raw.githubusercontent.com/Nikhil1602/chalpy-ai/refs/heads/main/public/logo.png" alt="Logo" width="80" style="display:block;margin:auto;border-radius:12px;background:#ffffff;padding:8px;" />
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:40px 30px;color:#1f2937;">
          <h1 style="margin:0 0 20px 0;font-size:24px;color:#111827;">
            ${templateDetails.title}
          </h1>

          <p style="font-size:16px;line-height:24px;margin-bottom:20px;color:#374151;">
            Hi ${templateDetails.name},
          </p>

          <p style="font-size:15px;line-height:24px;margin-bottom:30px;color:#4b5563;">
            ${templateDetails.description}
          </p>

          <!-- Button -->
          <div style="text-align:center;margin-bottom:30px;">
            <a href="${templateDetails.link}"
              style="background-color:#f97316;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">
              ${templateDetails.linkText}
            </a>
          </div>

          <p style="width:100%;display:flex;text-align:center;justify-content:center;align-items:center;font-size:13px;color:#6b7280;line-height:20px;">
            This link will expire in 48 hours.
          </p>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="border-top:1px solid #e5e7eb;"></td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:30px;text-align:center;background-color:#fff7ed;">
          
          <!-- Social Icons -->
          <div style="margin-bottom:15px;">
            <a href="https://www.linkedin.com/in/nikhil-barot-508968223/" style="margin:0 10px;text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="28" alt="LinkedIn" />
            </a>

            <a href="https://github.com/Nikhil1602" style="margin:0 10px;text-decoration:none;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="28" alt="GitHub" />
            </a>
          </div>

          <p style="font-size:12px;color:#6b7280;margin:0;">
            © 2026 Chalpy AI. All rights reserved.
          </p>

        </td>
      </tr>

    </table>
  </body>
</html>
`;

export const defaultLauncher: LauncherConfig = {
  backgroundColor: '#667eea',
  borderRadius: 50,
  padding: 8,
  icon: 'message',
  logoUrl: '',
  size: 56,
};

export const defaultTheme: ThemeConfig = {
  backgroundColor: '#ffffff',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientFrom: '#667eea',
  gradientTo: '#764ba2',
  textColor: '#1a1a2e',
  borderRadius: 16,
  fontFamily: 'Inter',
  logoUrl: '',
  position: 'bottom-right',
  accentColor: '#667eea',
  headerColor: '#667eea',
  launcher: defaultLauncher,
};

export const defaultAIModel: AIModelConfig = {
  provider: 'groq',
  model: 'llama-3.1-8b-instant',
  apiKey: process.env.GROQ_API_KEY || 'cx3xxxx2342S4r',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExt(name: string) {
  return name.split('.').pop()?.toUpperCase() || 'FILE';
}