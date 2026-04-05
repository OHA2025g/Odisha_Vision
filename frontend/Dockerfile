FROM node:20-alpine
WORKDIR /app

# Build context must be repository root (see docker-compose.yml).
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ ./

# Dev server must listen on all interfaces inside the container.
ENV HOST=0.0.0.0
ENV PORT=3000

# Override at image build time (e.g. EasyPanel build args) or at container runtime.
ARG REACT_APP_BACKEND_URL=
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

EXPOSE 3000
CMD ["yarn", "start"]
