// Mock for @sendgrid modules
module.exports = {
  mail: {
    Mail: jest.fn(),
    MailService: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({}),
    })),
  },
  client: {
    Client: jest.fn().mockImplementation(() => ({
      setApiKey: jest.fn(),
      request: jest.fn().mockResolvedValue({}),
    })),
  },
};
