var AxiosError = require('../../../lib/core/AxiosError');

describe('core::createError', function() {
  it('should create an Error with message, config, code, request, response and isAxiosError', function() {
    var request = { path: '/foo' };
    var response = { status: 200, data: { foo: 'bar' } };
    var error = new AxiosError('Boom!', { foo: 'bar' }, 'ESOMETHING', request, response);
    expect(error instanceof Error).toBe(true);
    expect(error.message).toBe('Boom!');
    expect(error.config).toEqual({ foo: 'bar' });
    expect(error.code).toBe('ESOMETHING');
    expect(error.request).toBe(request);
    expect(error.response).toBe(response);
    expect(error.isAxiosError).toBe(true);
  });
  it('should create an Error that can be serialized to JSON', function() {
    // Attempting to serialize request and response results in
    //    TypeError: Converting circular structure to JSON
    var request = { path: '/foo' };
    var response = { status: 200, data: { foo: 'bar' } };
    var error = new AxiosError('Boom!', { foo: 'bar' }, 'ESOMETHING', request, response);
    var json = error.toJSON();
    expect(json.message).toBe('Boom!');
    expect(json.config).toEqual({ foo: 'bar' });
    expect(json.code).toBe('ESOMETHING');
    expect(json.request).toBe(undefined);
    expect(json.response).toBe(undefined);
  });

  describe('core::createError.from', function() {
    it('should add config, config, request and response to error', function() {
      var error = new Error('Boom!');
      var request = { path: '/foo' };
      var response = { status: 200, data: { foo: 'bar' } };

      var axiosError = AxiosError.from(error, { foo: 'bar' }, 'ESOMETHING', request, response);
      expect(axiosError.config).toEqual({ foo: 'bar' });
      expect(axiosError.code).toBe('ESOMETHING');
      expect(axiosError.request).toBe(request);
      expect(axiosError.response).toBe(response);
      expect(axiosError.isAxiosError).toBe(true);
    });

    it('should return error', function() {
      var error = new Error('Boom!');
      expect(AxiosError.from(error, { foo: 'bar' }, 'ESOMETHING') instanceof AxiosError).toBeTruthy();
    });
  });
});
