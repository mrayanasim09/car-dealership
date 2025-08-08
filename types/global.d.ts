declare global {
  var mockRouter: {
    push: jest.Mock
    replace: jest.Mock
    prefetch: jest.Mock
    back: jest.Mock
    forward: jest.Mock
    refresh: jest.Mock
  }
}
