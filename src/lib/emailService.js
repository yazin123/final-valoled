// src/lib/emailService.js
const emailService = {
    sendContactEmail: async (formData, toEmail) => {
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            toEmail,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send email');
        }
  
        return {
          success: true,
          data
        };
      } catch (error) {
        console.error('Error sending email:', error);
        return {
          success: false,
          error: error.message || 'Failed to send email'
        };
      }
    }
  };
  
  export default emailService;