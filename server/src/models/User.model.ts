import mongoose, {
  Document,
  Model,
  Schema,
} from 'mongoose';

import bcrypt from 'bcryptjs';


// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;

  avatarUrl: string | null;
  bio: string | null;
  techStack: string[];
  githubUrl: string | null;
  linkedinUrl: string | null;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}


export interface IUserDocument
  extends IUser,
    Document {

  comparePassword(
    candidatePassword: string
  ): Promise<boolean>;

}


export interface IUserModel
  extends Model<IUserDocument> {

  findByEmail(
    email: string
  ): Promise<IUserDocument | null>;

}


// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema =
  new Schema<IUserDocument, IUserModel>(
    {

      name: {
        type: String,
        required: [
          true,
          'Name is required',
        ],
        trim: true,
        minlength: [
          2,
          'Name must be at least 2 characters',
        ],
        maxlength: [
          50,
          'Name cannot exceed 50 characters',
        ],
      },


      email: {
        type: String,
        required: [
          true,
          'Email is required',
        ],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^\S+@\S+\.\S+$/,
          'Please enter a valid email',
        ],
      },


      passwordHash: {
        type: String,
        required: true,
        select: false,
      },


      avatarUrl: {
        type: String,
        default: null,
        match: [
          /^https?:\/\/.+/,
          'Invalid avatar URL',
        ],
      },


      bio: {
        type: String,
        maxlength: [
          300,
          'Bio cannot exceed 300 characters',
        ],
        default: null,
      },


      techStack: {
        type: [String],
        default: [],
      },


      githubUrl: {
        type: String,
        default: null,
        match: [
          /^https?:\/\/(www\.)?github\.com\/.+/,
          'Invalid GitHub URL',
        ],
      },


      linkedinUrl: {
        type: String,
        default: null,
        match: [
          /^https?:\/\/(www\.)?linkedin\.com\/.+/,
          'Invalid LinkedIn URL',
        ],
      },


      isActive: {
        type: Boolean,
        default: true,
      },

    },


    {
      timestamps: true,

      toJSON: {

        transform(
          _doc,
          ret: Record<string, unknown>
        ) {

          delete ret.passwordHash;

          return ret;

        },

      },

    }
  );


// ─── Indexes ──────────────────────────────────────────────────────────────────


userSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
  }
);


userSchema.index(
  {
    isActive: 1,
  }
);


// ─── Instance Methods ─────────────────────────────────────────────────────────


userSchema.methods.comparePassword =
  async function (
    candidatePassword: string
  ): Promise<boolean> {

    return bcrypt.compare(
      candidatePassword,
      this.passwordHash
    );

  };


// ─── Static Methods ───────────────────────────────────────────────────────────


userSchema.statics.findByEmail =
  function (
    email: string
  ) {

    return this.findOne(
      {
        email:
          email.toLowerCase(),

        isActive: true,
      }
    ).select(
      '+passwordHash'
    );

  };


// ─── Model ────────────────────────────────────────────────────────────────────


export const User =
  mongoose.model<
    IUserDocument,
    IUserModel
  >(
    'User',
    userSchema
  );