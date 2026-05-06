FROM node:20-alpine

WORKDIR /app

# Use root .npmrc (china mirror) for npm install. Without this, the build
# host hits ECONNRESET against registry.yarnpkg.com / npmjs.org.
COPY .npmrc package.json package-lock.json tsconfig.base.json ./
COPY packages/website ./packages/website

ARG OMB_WEBSITE_URL=https://omb.org.cn
ARG OMB_DASHBOARD_URL=https://dashboard.omb.org.cn
ARG OMB_API_BASE_URL=https://api.omb.org.cn
ARG OMB_CHROME_STORE_URL=https://chromewebstore.google.com/detail/oh-my-browser-lite
ARG OMB_EXTENSION_VERSION=0.4.0
ENV OMB_WEBSITE_URL=$OMB_WEBSITE_URL
ENV OMB_DASHBOARD_URL=$OMB_DASHBOARD_URL
ENV OMB_API_BASE_URL=$OMB_API_BASE_URL
ENV OMB_CHROME_STORE_URL=$OMB_CHROME_STORE_URL
ENV OMB_EXTENSION_VERSION=$OMB_EXTENSION_VERSION

RUN npm install
# alpine is musl libc but next 16's swc binary auto-detect occasionally
# resolves to a `-gnu` variant and tries to fetch from registry.yarnpkg.com
# at build time, which ECONNRESETs on china-network hosts. Pre-install both
# musl variants explicitly (one per arch); npm picks the matching one and
# next build uses the cached binary instead of fetching. The fallback runs
# if neither variant works on this host (extremely rare; next will fall
# back to its WASM SWC build, slower but works offline).
RUN npm install --no-save \
       @next/swc-linux-x64-musl \
       @next/swc-linux-arm64-musl \
       2>/dev/null || true
# next build resolves swc from node_modules/@next/swc-* if pre-installed,
# else tries the registry. NEXT_TELEMETRY_DISABLED kills another network
# round-trip that has nothing to do with the build itself.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace @omb/website

EXPOSE 4174

CMD ["npx", "--workspace", "@omb/website", "next", "start", "-p", "4174", "-H", "0.0.0.0"]
