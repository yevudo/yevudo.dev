<script setup lang="ts">
  const { locale, t } = useI18n();

  const [
    profileResponse,
    employmentsRecordsResponse,
    educationsRecordsResponse,
    petProjectsResponse,
  ] = await Promise.all([
    useFetch(`/api/profile`, {
      query: { locale: locale.value },
      key: `profile-${locale.value}`,
    }),
    useFetch(`/api/employments-records`, {
      query: { locale: locale.value },
      key: `employments-records-${locale.value}`,
    }),
    useFetch(`/api/educations-records`, {
      query: { locale: locale.value },
      key: `educations-records-${locale.value}`,
    }),
    useFetch(`/api/pet-projects`, {
      query: { locale: locale.value },
      key: `pet-projects-${locale.value}`,
    }),
  ]);

  const profile = computed(() => {
    return profileResponse.data.value;
  });
  const employmentsRecords = computed(() => {
    return employmentsRecordsResponse.data.value || [];
  });
  const educationsRecords = computed(() => {
    return educationsRecordsResponse.data.value || [];
  });
  const petProjects = computed(() => petProjectsResponse.data.value || []);
  const localeFormatted = computed(() =>
    locale.value === 'uk' ? 'uk_UA' : 'en_US'
  );

  const authorName = computed(() => {
    return `${profile.value?.firstName} ${profile.value?.lastName}`;
  });

  const siteUrl = 'https://yevudo.dev';
  const pageTitle = computed(() => {
    return `${authorName.value} - ${t('seo.title.suffix')}`;
  });

  const pageDescription = computed(() => {
    return profile.value?.about ?? '';
  });

  const personData = computed(() => {
    if (!profile.value) {
      return null;
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: authorName.value,
      givenName: profile.value.firstName,
      familyName: profile.value.lastName,
      jobTitle: profile.value.title,
      description: profile.value.about,
      url: siteUrl,
      email: profile.value.contacts.email,
      image: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/profile-light.png`,
        width: '400',
        height: '400',
      },
      sameAs: [profile.value.contacts.linkedin, profile.value.contacts.github],
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.value.location,
      },
      knowsAbout: [
        ...profile.value.feSkills,
        ...profile.value.beSkills,
        ...profile.value.tools,
      ],
      knowsLanguage: profile.value.spokenLanguages.map((lang) => ({
        '@type': 'Language',
        name: lang.name,
      })),
      worksFor: employmentsRecords.value.map((job) => ({
        '@type': 'Organization',
        name: job.company.name,
        url: job.company.website,
      })),
      alumniOf: educationsRecords.value.map((edu) => ({
        '@type': 'EducationalOrganization',
        name: edu.institution,
        url: edu.institutionLink,
      })),
    };
  });

  const websiteSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: pageTitle.value,
    description: pageDescription.value,
    inLanguage: ['uk', 'en'],
    author: {
      '@id': `${siteUrl}/#person`,
    },
  }));

  const seo: Record<string, string> = {
    title: pageTitle.value,
    description: pageDescription.value,
    author: authorName.value,
    robots: 'index, follow',
    ogTitle: pageTitle.value,
    ogDescription: pageDescription.value,
    ogType: 'profile',
    ogUrl: `${siteUrl}/${locale.value}`,
    ogImage: `${siteUrl}/og-image.png`,
    ogImageAlt: pageTitle.value,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/png',
    ogLocale: localeFormatted.value,
    ogLocaleAlternate: localeFormatted.value === 'uk_UA' ? 'en_US' : 'uk_UA',
    ogSiteName: `${authorName.value} - Professional CV`,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle.value,
    twitterDescription: pageDescription.value,
    twitterImage: `${siteUrl}/og-image.png`,
    twitterImageAlt: pageTitle.value,
  };

  useSeoMeta(seo);

  useHead({
    htmlAttrs: {
      lang: locale.value,
    },
    link: [
      {
        rel: 'canonical',
        href: `${siteUrl}/${locale.value}`,
      },
      {
        rel: 'alternate',
        hreflang: 'uk',
        href: `${siteUrl}/uk`,
      },
      {
        rel: 'alternate',
        hreflang: 'en',
        href: `${siteUrl}/en`,
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${siteUrl}/uk`,
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () => JSON.stringify(personData.value),
      },
      {
        type: 'application/ld+json',
        innerHTML: () => JSON.stringify(websiteSchema.value),
      },
    ],
  });
</script>

<template>
  <UContainer v-if="profile">
    <AppHeader :profile />
    <UMain class="mt-8">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-1">
          <CardProfile :profile />
          <CardAbout :profile />
          <CardSkills :profile />
          <CardLanguages :profile />
        </div>
        <div class="space-y-6 lg:col-span-2">
          <SectionExperience
            v-if="employmentsRecords.length > 0"
            :records="employmentsRecords"
          />
          <SectionEducation
            v-if="educationsRecords.length > 0"
            :records="educationsRecords"
          />
          <SectionPetProjects v-if="petProjects" :pet-projects="petProjects" />
        </div>
      </div>
    </UMain>
    <AppFooter :profile="profile" />
  </UContainer>
</template>
