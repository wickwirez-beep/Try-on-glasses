/**
 * Email & SMS Notification Module
 * Sends personalized recommendations and updates to users
 */

import { z } from "zod";

export interface NotificationPreferences {
  userId: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  recommendationFrequency: "daily" | "weekly" | "monthly" | "never";
  notificationTypes: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

// Mock email templates
const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to The Look - Virtual Glasses Try-On",
    htmlContent: `
      <h1>Welcome to The Look!</h1>
      <p>Hi {{userName}},</p>
      <p>We're excited to have you join us. Start exploring our collection of premium glasses frames today.</p>
      <a href="{{appUrl}}/try-on">Try On Glasses Now</a>
    `,
    variables: ["userName", "appUrl"],
  },
  recommendation: {
    id: "recommendation",
    name: "Personalized Recommendations",
    subject: "{{userName}}, we found frames perfect for you!",
    htmlContent: `
      <h1>Personalized Recommendations</h1>
      <p>Hi {{userName}},</p>
      <p>Based on your face shape ({{faceShape}}), we recommend these styles:</p>
      <ul>
        <li>{{recommendedStyle1}}</li>
        <li>{{recommendedStyle2}}</li>
        <li>{{recommendedStyle3}}</li>
      </ul>
      <a href="{{appUrl}}/try-on">View Recommendations</a>
    `,
    variables: ["userName", "faceShape", "recommendedStyle1", "recommendedStyle2", "recommendedStyle3", "appUrl"],
  },
  abandonedCart: {
    id: "abandoned_cart",
    name: "Abandoned Cart Recovery",
    subject: "Don't miss out on {{frameName}}!",
    htmlContent: `
      <h1>You left something behind</h1>
      <p>Hi {{userName}},</p>
      <p>You were checking out {{frameName}} by {{brand}}. Complete your purchase now!</p>
      <a href="{{purchaseUrl}}">Complete Purchase</a>
    `,
    variables: ["userName", "frameName", "brand", "purchaseUrl"],
  },
  newArrivals: {
    id: "new_arrivals",
    name: "New Arrivals Notification",
    subject: "New {{style}} frames just arrived!",
    htmlContent: `
      <h1>New Arrivals</h1>
      <p>Hi {{userName}},</p>
      <p>Check out our latest {{style}} collection:</p>
      <a href="{{appUrl}}/try-on?style={{style}}">View New {{style}} Frames</a>
    `,
    variables: ["userName", "style", "appUrl"],
  },
};

// Mock SMS templates
const smsTemplates: Record<string, SMSTemplate> = {
  welcome: {
    id: "welcome",
    name: "Welcome SMS",
    content: "Welcome to The Look! Start trying on glasses: {{appUrl}}/try-on",
    variables: ["appUrl"],
  },
  recommendation: {
    id: "recommendation",
    name: "Recommendation SMS",
    content: "Hi {{userName}}! We found {{style}} frames perfect for you. Try them now: {{appUrl}}/try-on",
    variables: ["userName", "style", "appUrl"],
  },
  reminder: {
    id: "reminder",
    name: "Reminder SMS",
    content: "{{userName}}, complete your purchase of {{frameName}}: {{purchaseUrl}}",
    variables: ["userName", "frameName", "purchaseUrl"],
  },
};

/**
 * Get notification preferences for user
 */
export async function getNotificationPreferences(userId: number): Promise<NotificationPreferences> {
  // Mock implementation - in production, fetch from database
  return {
    userId,
    emailNotifications: true,
    smsNotifications: false,
    recommendationFrequency: "weekly",
    notificationTypes: ["recommendations", "new_arrivals", "abandoned_cart"],
  };
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: number,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  // Mock implementation - in production, update database
  return {
    userId,
    emailNotifications: preferences.emailNotifications ?? true,
    smsNotifications: preferences.smsNotifications ?? false,
    recommendationFrequency: preferences.recommendationFrequency ?? "weekly",
    notificationTypes: preferences.notificationTypes ?? [],
  };
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  userId: number,
  userEmail: string,
  userName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = emailTemplates.welcome;
    const content = template.htmlContent
      .replace("{{userName}}", userName)
      .replace("{{appUrl}}", "https://the-look.app");

    console.log(`Sending welcome email to ${userEmail}:`, content);

    // In production, use SendGrid, Mailgun, or AWS SES
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send personalized recommendation email
 */
export async function sendRecommendationEmail(
  userId: number,
  userEmail: string,
  userName: string,
  faceShape: string,
  recommendedStyles: string[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = emailTemplates.recommendation;
    let content = template.htmlContent
      .replace("{{userName}}", userName)
      .replace("{{faceShape}}", faceShape)
      .replace("{{appUrl}}", "https://the-look.app");

    recommendedStyles.forEach((style, index) => {
      content = content.replace(`{{recommendedStyle${index + 1}}}`, style);
    });

    console.log(`Sending recommendation email to ${userEmail}:`, content);

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send abandoned cart recovery email
 */
export async function sendAbandonedCartEmail(
  userId: number,
  userEmail: string,
  userName: string,
  frameName: string,
  brand: string,
  purchaseUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = emailTemplates.abandonedCart;
    const content = template.htmlContent
      .replace("{{userName}}", userName)
      .replace("{{frameName}}", frameName)
      .replace("{{brand}}", brand)
      .replace("{{purchaseUrl}}", purchaseUrl);

    console.log(`Sending abandoned cart email to ${userEmail}:`, content);

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send new arrivals notification
 */
export async function sendNewArrivalsEmail(
  userId: number,
  userEmail: string,
  userName: string,
  style: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = emailTemplates.newArrivals;
    const content = template.htmlContent
      .replace("{{userName}}", userName)
      .replace("{{style}}", style)
      .replace(/{{appUrl}}/g, "https://the-look.app")
      .replace(/{{style}}/g, style);

    console.log(`Sending new arrivals email to ${userEmail}:`, content);

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send SMS notification
 */
export async function sendSMS(
  userId: number,
  phoneNumber: string,
  templateId: string,
  variables: Record<string, string>
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = smsTemplates[templateId];
    if (!template) {
      return { success: false, error: "Template not found" };
    }

    let content = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(`{{${key}}}`, value);
    });

    console.log(`Sending SMS to ${phoneNumber}:`, content);

    // In production, use Twilio, AWS SNS, or similar
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send bulk recommendation emails
 */
export async function sendBulkRecommendations(
  users: Array<{
    userId: number;
    email: string;
    name: string;
    faceShape: string;
    recommendedStyles: string[];
  }>
): Promise<Array<{ userId: number; success: boolean; messageId?: string }>> {
  const results = await Promise.all(
    users.map((user) =>
      sendRecommendationEmail(
        user.userId,
        user.email,
        user.name,
        user.faceShape,
        user.recommendedStyles
      ).then((result) => ({
        userId: user.userId,
        success: result.success,
        messageId: result.messageId,
      }))
    )
  );

  return results;
}

/**
 * Get email template
 */
export function getEmailTemplate(templateId: string): EmailTemplate | null {
  return emailTemplates[templateId] || null;
}

/**
 * Get SMS template
 */
export function getSMSTemplate(templateId: string): SMSTemplate | null {
  return smsTemplates[templateId] || null;
}
