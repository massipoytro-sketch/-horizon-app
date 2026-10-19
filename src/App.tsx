import { useMemo, useState } from 'react';

type Provider = {
  id: string;
  name: string;
  category: string;
  description: string;
  source: string;
  status: 'review' | 'configured';
  features: string[];
};

const providers: Provider[] = [
  {
    id: 'cpalead',
    name: 'CPAlead',
    category: 'شبكة عروض',
    description: 'عروض CPA تتغير حسب البلد والجهاز، مع دعم تتبع المستخدم والتحويلات.',
    source: 'rewards-platform + Supabase',
    status: 'review',
    features: ['جلب العروض', 'روابط التتبع', 'Postback للتحويلات'],
  },
  {
    id: 'cpagrip',
    name: 'CPAGrip',
    category: 'Offerwall',
    description: 'جدار عروض عبر رابط الناشر الرسمي، مع نقطة استقبال للتحويلات.',
    source: 'rewards-platform + Supabase',
    status: 'review',
    features: ['رابط Offerwall', 'إسناد المستخدم', 'Postback للتحويلات'],
  },
  {
    id: 'timewall',
    name: 'TimeWall',
    category: 'عروض ومهام',
    description: 'جدار عروض مستقل واستبيانات عبر واجهات تكامل موجودة في المشروع الأصلي.',
    source: 'rewards-platform + Supabase',
    status: 'review',
    features: ['Offerwall', 'استبيانات', 'Postback للتحويلات'],
  },
  {
    id: 'cpx',
    name: 'CPX Research',
    category: 'استبيانات',
    description: 'تكامل استبيانات مع إعداد رابط مخصص ومعالجة إشعارات التحويل.',
    source: 'rewards-platform + Supabase',
    status: 'review',
    features: ['رابط استبيانات', 'Secure hash', 'Postback للتحويلات'],
  },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">H</span>;
}

function ProviderLogo({ id }: { id: string }) {
  const letter = id === 'cpx' ? 'X' : id === 'cpalead' ? 'C' : id === 'cpagrip' ? 'G' : 'T';
  return <span className={'provider-logo logo-' + id}>{letter}</span>;
}

export default function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('الكل');
  const [selected, setSelected] = useState<string | null>(null);

  const visibleProviders = useMemo(() => providers.filter((provider) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [provider.name, provider.category, provider.description].some((value) => value.toLowerCase().includes(query));
    const matchesFilter = filter === 'الكل'
      || (filter === 'العروض' && ['cpalead', 'cpagrip', 'timewall'].includes(provider.id))
      || (filter === 'الاستبيانات' && ['timewall', 'cpx'].includes(provider.id));
    return matchesSearch && matchesFilter;
  }), [search, filter]);

  const activeProvider = providers.find((provider) => provider.id === selected);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setSelected(null); }}>
          <BrandMark />
          <span><strong>Horizon</strong><small>Offer Network</small></span>
        </a>
        <nav className="top-links" aria-label="التنقل">
          <a className="active" href="#networks">الشبكات</a>
          <a href="#workflow">طريقة العمل</a>
        </nav>
        <span className="header-badge"><i /> نسخة أولية</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">شبكة عروض مستقلة</span>
            <h1>كل شبكات العروض،<br /><span>في مكان واحد.</span></h1>
            <p>مساحة بسيطة لإدارة مزودي العروض والاستبيانات. بدأنا بقائمة الشركات الموجودة فعليًا في مستودع GainiRen وقاعدة بياناته.</p>
            <a className="primary-button" href="#networks">استعرض الشبكات <span aria-hidden="true">←</span></a>
          </div>
          <div className="hero-card" aria-label="ملخص الشبكات">
            <div className="summary-head"><span>ملخص الشبكة</span><span className="summary-dot" /></div>
            <div className="summary-number">04 <small>شركات</small></div>
            <div className="summary-divider" />
            <div className="summary-row"><span>شبكات عروض</span><strong>03</strong></div>
            <div className="summary-row"><span>شبكات استبيانات</span><strong>02</strong></div>
            <p className="summary-note">الأعداد حسب أنواع الخدمات، وقد تقدم الشركة الواحدة أكثر من نوع.</p>
          </div>
          <div className="hero-decoration" aria-hidden="true" />
        </section>

        <section className="network-section" id="networks">
          <div className="section-heading">
            <div>
              <span className="eyebrow">المزودون</span>
              <h2>شبكات العروض</h2>
              <p>الشركات التي عثرنا عليها في المشروع الأصلي.</p>
            </div>
            <span className="count-pill">{visibleProviders.length} شبكات</span>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن شركة..." aria-label="ابحث عن شركة" />
            </label>
            <div className="filters" role="group" aria-label="تصفية الشبكات">
              {['الكل', 'العروض', 'الاستبيانات'].map((item) => (
                <button key={item} className={filter === item ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="provider-grid">
            {visibleProviders.map((provider) => (
              <article className="provider-card" key={provider.id}>
                <div className="provider-top">
                  <ProviderLogo id={provider.id} />
                  <span className="provider-type">{provider.category}</span>
                </div>
                <h3>{provider.name}</h3>
                <p className="provider-description">{provider.description}</p>
                <div className="feature-list">
                  {provider.features.map((feature) => <span key={feature}><i />{feature}</span>)}
                </div>
                <div className="card-footer">
                  <span className="status"><i /> يحتاج اختبار الاتصال</span>
                  <button className="details-button" onClick={() => setSelected(provider.id)}>التفاصيل <span aria-hidden="true">←</span></button>
                </div>
              </article>
            ))}
            {visibleProviders.length === 0 && <div className="empty-state">لا توجد شركة تطابق البحث.</div>}
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="section-heading">
            <div><span className="eyebrow">خطوات العمل</span><h2>نبنيها خطوة بخطوة</h2></div>
          </div>
          <div className="steps-grid">
            <div className="step"><span>01</span><h3>حصر التكاملات</h3><p>جمع ملفات الشركات وإعداداتها من المشروع الأصلي دون نقل مفاتيح سرية.</p></div>
            <div className="step"><span>02</span><h3>واجهة بسيطة</h3><p>عرض موحد وواضح لكل شبكة، بتصميم أبيض متجاوب مع الهاتف.</p></div>
            <div className="step"><span>03</span><h3>اختبار الاتصال</h3><p>التحقق من بيانات الناشر وجلب العروض واستقبال التحويلات قبل الإطلاق.</p></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#"><BrandMark /><span><strong>Horizon</strong><small>Offer Network</small></span></a>
        <span>مشروع مستقل · النسخة الأولية</span>
      </footer>

      {activeProvider && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" aria-label="إغلاق" onClick={() => setSelected(null)}>×</button>
            <div className="provider-top"><ProviderLogo id={activeProvider.id} /><span className="provider-type">{activeProvider.category}</span></div>
            <h2 id="modal-title">{activeProvider.name}</h2>
            <p>{activeProvider.description}</p>
            <div className="detail-source"><span>مصدر المراجعة</span><strong>{activeProvider.source}</strong></div>
            <h3>الأجزاء التي سنختبرها</h3>
            <ul>{activeProvider.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <div className="notice"><strong>الحالة: غير مؤكدة بعد</strong><p>وجدنا ملفات التكامل في المشروع الأصلي، لكن لم نثبت بعد أن حساب الناشر يعيد عروضًا مباشرة في هذه النسخة المستقلة.</p></div>
            <button className="primary-button modal-action" onClick={() => setSelected(null)}>حسنًا، فهمت</button>
          </section>
        </div>
      )}
    </div>
  );
}
