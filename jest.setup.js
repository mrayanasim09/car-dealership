// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { fetch, Headers, Request, Response } from 'cross-fetch'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.fetch = fetch
global.Headers = Headers
global.Request = Request
global.Response = Response

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
}))

// Export mockRouter for tests
global.mockRouter = mockRouter

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}))

// Mock Firebase
const mockApp = {}
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => mockApp),
  getApps: jest.fn(() => [mockApp]),
  getApp: jest.fn(() => mockApp),
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  })),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  setDoc: jest.fn(() => Promise.resolve()),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, docs: [] })),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
}))

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}
