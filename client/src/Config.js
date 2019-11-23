const Config = {
  defaultInsertFormValue: {
    type: {
      type: 'radio',
      description: {
        student: {
          value: 0,
          checked: false
        },
        tutor: {
          value: 1,
          checked: false
        }
      }
    },
    username: {
      value: '',
      type: 'text'
    },
    password: {
      value: '',
      type: 'password'
    },
    firstname: {
      value: '',
      type: 'text'
    },
    lastname: {
      value: '',
      type: 'text'
    },
    gender: {
      type: 'radio',
      description: {
        male: {
          value: 0,
          checked: false
        },
        female: {
          value: 1,
          checked: false
        }
      }
    },
    birthday: {
      value: '',
      type: 'date'
    },
    phone: {
      value: '',
      type: 'text'
    },
    latitude: {
      value: 0,
      type: 'number'
    },
    longitude: {
      value: 0,
      type: 'number'
    },
    bio: {
      value: '',
      type: 'textarea'
    }
  },

  defaultQueryFormValue: {
    distance: {
      checked: false,
      type: 'checkbox'
    },
    myLatitude: {
      value: null,
      type: 'number',
      dependency: 'distance'
    },
    myLongitude: {
      value: null,
      type: 'number',
      dependency: 'distance'
    },
    maxDistance: {
      value: null,
      type: 'number',
      dependency: 'distance'
    },
    male: {
      checked: false,
      type: 'checkbox'
    },
    female: {
      checked: false,
      type: 'checkbox'
    },
    age: {
      checked: false,
      type: 'checkbox'
    },
    min: {
      type: 'number',
      value: null,
      dependency: 'age'
    },
    max: {
      type: 'number',
      value: null,
      dependency: 'age'
    }
  }
};

export default Config;
