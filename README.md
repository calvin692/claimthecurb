# Claim the Curb

Public site for the Curb Claim bottle-drive map.

- https://www.claimthecurb.com
- https://www.claimthecurb.ca

Same pages on both names. Repo: https://github.com/calvin692/claimthecurb

## Connect both domains in Cloudflare Pages

1. Workers & Pages → Create → Connect to Git → `calvin692/claimthecurb`
2. Framework preset: None. Build command empty. Output directory: `/`
3. After the first `*.pages.dev` deploy works, Custom domains:
   - `www.claimthecurb.com`
   - `claimthecurb.com`
   - `www.claimthecurb.ca`
   - `claimthecurb.ca`
4. Each domain must be a zone on the same Cloudflare account (or CNAME at the registrar).
5. Redirect apex → www if you want one spelling.

## Pages

- `/` home
- `/how.html` four taps
- `/teams.html` flyers
- `/legal/privacy.html`

Beta tester code: HAUL-7N3Q  
Mail: hello@claimthecurb.com and hello@claimthecurb.ca
