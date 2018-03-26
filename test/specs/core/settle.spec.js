import settle from '../../../lib/core/settle'
import AxiosError from '../../../lib/core/AxiosError'

describe('core::settle', function () {
  let resolve
  let reject

  beforeEach(function () {
    resolve = jasmine.createSpy('resolve')
    reject = jasmine.createSpy('reject')
  })

  it('should resolve promise if status is not set', function () {
    const response = {
      config: {
        validateStatus: function () {
          return true
        }
      }
    }
    settle(resolve, reject, response)
    expect(resolve).toHaveBeenCalledWith(response)
    expect(reject).not.toHaveBeenCalled()
  })

  it('should resolve promise if validateStatus is not set', function () {
    const response = {
      status: 500,
      config: {
      }
    }
    settle(resolve, reject, response)
    expect(resolve).toHaveBeenCalledWith(response)
    expect(reject).not.toHaveBeenCalled()
  })

  it('should resolve promise if validateStatus returns true', function () {
    const response = {
      status: 500,
      config: {
        validateStatus: function () {
          return true
        }
      }
    }
    settle(resolve, reject, response)
    expect(resolve).toHaveBeenCalledWith(response)
    expect(reject).not.toHaveBeenCalled()
  })

  it('should reject promise if validateStatus returns false', function () {
    const req = {
      path: '/foo'
    }
    const response = {
      status: 500,
      config: {
        validateStatus: function () {
          return false
        }
      },
      request: req
    }
    settle(resolve, reject, response)
    expect(resolve).not.toHaveBeenCalled()
    expect(reject).toHaveBeenCalled()
    const reason = reject.calls.first().args[0]
    expect(reason instanceof Error).toBe(true)
    expect(reason instanceof AxiosError).toBe(true)
    expect(reason.message).toBe('Request failed with status code 500')
    expect(reason.config).toBe(response.config)
    expect(reason.request).toBe(req)
    expect(reason.response).toBe(response)
  })

  it('should pass status to validateStatus', function () {
    const validateStatus = jasmine.createSpy('validateStatus')
    const response = {
      status: 500,
      config: {
        validateStatus: validateStatus
      }
    }
    settle(resolve, reject, response)
    expect(validateStatus).toHaveBeenCalledWith(500)
  })
})
