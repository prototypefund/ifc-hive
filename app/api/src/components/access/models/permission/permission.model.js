/*
 * Permission Model
 *
 * Permissions grant some PRIVILEGE for a USER in a certain CONTEXT,
 * e.g. account, projects, etc.
 */

import mongoose from 'mongoose'
const { Schema } = mongoose

const permissionSchema = new Schema({

  /* what is the scope of the permission? */
  scope: {
    type: String,
    enum: ['account', 'project', 'group', 'object'],
    default: 'account',
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'owner', 'admin', 'editor', 'member', 'guest'],
    required: true
  }
})

permissionSchema.set('timestamps', true)

const Permission = mongoose.model('ifc_access_permission', permissionSchema)

export default Permission
