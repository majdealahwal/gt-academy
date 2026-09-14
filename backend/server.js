const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Course Catalog (in-memory "database") =====
// في الـ Part 4 هذا الـ array ممكن ينتقل لملف منفصل أو ConfigMap
const courses = [
  { id: 1, name: 'CCNA 200-301', vendor: 'Cisco', color: '#049FD9', level: 'Associate' },
  { id: 2, name: 'CCNP Enterprise', vendor: 'Cisco', color: '#049FD9', level: 'Professional' },
  { id: 3, name: 'CCIE Enterprise Infrastructure', vendor: 'Cisco', color: '#049FD9', level: 'Expert' },
  { id: 4, name: 'VMware VCP-DCV', vendor: 'VMware', color: '#607078', level: 'Professional' },
  { id: 5, name: 'Azure Fundamentals (AZ-900)', vendor: 'Microsoft', color: '#0078D4', level: 'Fundamentals' },
  { id: 6, name: 'Fortinet NSE', vendor: 'Fortinet', color: '#EE3124', level: 'Associate' },
];

// Middleware بسيط عشان نسمح بأي origin أثناء التطوير المحلي
// (في الإنتاج جوة Kubernetes، nginx proxy بيخلي هذا غير ضروري - راجع Part 4)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// ===== Routes =====

// Health check - يُستخدم لاحقًا كـ liveness/readiness probe في Kubernetes (Part 4)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'gt-backend',
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Course catalog endpoint
app.get('/api/courses', (req, res) => {
  res.status(200).json(courses);
});

// Fallback بسيط لأي مسار غير معروف
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// نصدّر app بدون تشغيل listen() مباشرة، عشان الـ tests تقدر تستخدمه بدون فتح بورت حقيقي
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GloryTech Academy backend running on port ${PORT}`);
  });
}

module.exports = app;
