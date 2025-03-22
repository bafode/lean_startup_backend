// Mock for firebase-admin
module.exports = {
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn()
  },
  messaging: jest.fn().mockReturnValue({
    send: jest.fn().mockResolvedValue('message-id'),
    sendMulticast: jest.fn().mockResolvedValue({ successCount: 1, failureCount: 0 }),
    sendToDevice: jest.fn().mockResolvedValue({ successCount: 1, failureCount: 0 }),
    sendToTopic: jest.fn().mockResolvedValue({ messageId: 'message-id' })
  }),
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue({}),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: jest.fn().mockReturnValue({})
    }),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({})
  }),
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'user-id' }),
    createUser: jest.fn().mockResolvedValue({ uid: 'user-id' }),
    updateUser: jest.fn().mockResolvedValue({ uid: 'user-id' }),
    deleteUser: jest.fn().mockResolvedValue({}),
    getUser: jest.fn().mockResolvedValue({ uid: 'user-id', email: 'user@example.com' })
  })
};
