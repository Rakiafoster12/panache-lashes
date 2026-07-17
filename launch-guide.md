# Panache Lashes Launch & SEO Handoff

## Current launch target

The website is configured for **https://panachelashes.com**. Appointment calls to action continue to open the existing Square Appointments flow, so publishing this website does not replace or interrupt Square booking.

| Area             | Final configuration                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Public website   | `https://panachelashes.com`                                                                                             |
| Booking          | Existing Square Appointments booking URL                                                                                |
| Google profile   | Reverified PANACHE LASHES profile linked from the website                                                               |
| Search discovery | `robots.txt`, `sitemap.xml`, canonical tags, route metadata, social metadata, and LocalBusiness/service structured data |
| Public routes    | Home, Services, About, Contact, Policies, FAQ, and Privacy                                                              |

## Development environment secrets

The Google profile and optional Panache Concierge use server-side secrets. Add
these in Manus project settings or a local `.env` file; never place their
values in browser code or commit them to GitHub.

```env
GOOGLE_PLACES_API_KEY=your_google_places_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_CHAT_MODEL=gpt-5.6-luna
```

`OPENAI_CHAT_MODEL` is optional and defaults to `gpt-5.6-luna`. Start locally by
copying `.env.example` to the ignored `.env` file. The concierge
remains visible without an OpenAI key but responds with the studio's direct
contact fallback until the key is configured.

## 1. Publish from Manus

First open the latest project checkpoint and review the Preview panel. Then select **Publish** in the project header. Manus provides built-in hosting and custom-domain support; no separate hosting account is required.

After the first publication, open **Settings → Domains** and add `panachelashes.com`. Copy the DNS values shown by Manus exactly. Do not guess the A or CNAME target, because the values are assigned by the hosting platform.

## 2. Point the Square-managed domain to Manus

Square’s current domain controls are under **Square Dashboard → Channels → Domains → Manage → Manage domain**. Under **DNS Records**, edit only the web-hosting records that Manus identifies. Square advises using A or CNAME records rather than replacing nameservers when the domain remains managed by Square, because changing nameservers can interrupt the website and connected email. DNS changes can take **24–48 hours** to propagate.[1]

Before saving any change, take a screenshot or export a copy of the existing DNS records. Preserve all **MX**, email-verification, DKIM, SPF, and other unrelated TXT records. Do not cancel the Square domain or Square Appointments service.

| Cutover step                   | Owner check                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Add the custom domain in Manus | Manus displays the required DNS record values                                                          |
| Back up current Square DNS     | Screenshot or copy every existing record                                                               |
| Replace only web records       | Update only the A/CNAME records specified by Manus                                                     |
| Preserve email records         | MX, SPF, DKIM, and email TXT records remain unchanged                                                  |
| Verify both hostnames          | `panachelashes.com` and `www.panachelashes.com` resolve to the published site or redirect consistently |
| Confirm HTTPS                  | The browser shows a secure connection after certificate provisioning                                   |
| Confirm booking                | Every booking button still opens the Square Appointments page                                          |

Avoid changing nameservers unless Manus explicitly requires it and all email records have been inventoried. The lower-risk route is to keep Square as the registrar/DNS manager and point only the website records.

## 3. Complete Google Search Console setup

Open [Google Search Console](https://search.google.com/search-console/about) and add a **Domain property** for `panachelashes.com`. Google requires DNS verification for a Domain property.[2] Add the TXT verification record in Square’s DNS manager and keep it in place after verification.

Once the published domain is live:

1. Submit `https://panachelashes.com/sitemap.xml` in the **Sitemaps** report. Google uses this report to process the sitemap and report errors.[3]
2. Use **URL Inspection** for the homepage and each public route. Test the live URL, then request indexing when appropriate.[4]
3. Confirm the canonical URL shown by Google matches the page URL.
4. Review **Page indexing**, **Core Web Vitals**, **HTTPS**, and structured-data enhancement reports weekly during the first month.
5. Do not expect rankings to change immediately. Compare impressions, clicks, queries, and indexed pages after 14 and 28 days before making major content changes.

The initial inspection list is:

| Page     | URL                                  |
| -------- | ------------------------------------ |
| Home     | `https://panachelashes.com/`         |
| Services | `https://panachelashes.com/services` |
| About    | `https://panachelashes.com/about`    |
| Contact  | `https://panachelashes.com/contact`  |
| Policies | `https://panachelashes.com/policies` |
| FAQ      | `https://panachelashes.com/faq`      |
| Privacy  | `https://panachelashes.com/privacy`  |

## 4. Rotate and restrict the Google Places key

The development Google Places key is stored only as a server-side project secret and is not committed to the repository or sent to the browser. Before public launch, rotate the key in Google Cloud, update the project secret, and revoke the old key after the new one passes the profile test.

Restrict the replacement key to **Places API (New)** and only the APIs actually used. Because autoscaled server hosting may not provide a fixed outbound IP address, do not add an IP restriction unless a stable egress address is confirmed. Enable quota alerts and review usage after launch.

The final post-reverification response provides the verified business name, Troy address, phone, hours, Google Maps link, **5.0 rating**, **17-review count**, and five genuine review objects with written text. The website presents only those live Google reviews; it does not seed, hardcode, rewrite, or fabricate customer testimony. If Google temporarily omits written excerpts in a future response, the design falls back to the factual rating, count, and verified-profile link.

## 5. Launch-day acceptance check

Complete this pass after DNS resolves and before announcing the new site:

| Check                              | Expected result                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Homepage and six supporting routes | Load over HTTPS with no redirect loop                                                                                            |
| Mobile navigation                  | Opens, closes, identifies the current page, and reaches all routes by keyboard                                                   |
| Wordmarks and editorial images     | Render in the header, hero, service sections, and footer                                                                         |
| Google trust section               | Shows live rating/count and links to the verified profile                                                                        |
| Contact map                        | Loads the PANACHE LASHES location after entering the viewport                                                                    |
| Directions form                    | Opens directions without exposing private information                                                                            |
| Square booking links               | Open the existing appointment flow in a new tab; complete one manual test booking up to the confirmation step without submitting |
| `robots.txt`                       | Loads publicly                                                                                                                   |
| `sitemap.xml`                      | Lists the seven canonical routes                                                                                                 |
| Social preview                     | Uses the Panache editorial hero image                                                                                            |
| Unknown URL                        | Returns a true 404 response with `noindex` metadata                                                                              |

## 6. First-month SEO learning plan

During the first four weeks, keep the page structure and URLs stable so Google can learn the new site. Review Search Console once per week and record impressions, clicks, top queries, indexing status, and any enhancement warnings. Use genuine customer language and observed query data to guide later FAQ or service-copy changes. Do not publish fabricated reviews, ratings, or locality claims.

Keep the Google Business Profile name, address, phone, hours, website URL, and booking link consistent with the website. Continue requesting reviews through normal client follow-up, but do not gate, incentivize, or rewrite them.

The sandbox browser reached Square’s security-verification interstitial at the configured appointment URL. Square commonly protects appointment flows from automated traffic, so the owner should complete the launch-day manual booking-link check in a normal browser. Do not submit an appointment unless a real booking is intended.

## Official references

[1]: [Square — Manage records for Square Online domains](https://squareup.com/help/us/en/article/6962-manage-dns-records)
[2]: [Google Search Console — Verify site ownership](https://support.google.com/webmasters/answer/9008080?hl=en)
[3]: [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
[4]: [Google Search Console — URL Inspection tool](https://support.google.com/webmasters/answer/9012289?hl=en)
