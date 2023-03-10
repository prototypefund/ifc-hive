/*
 * ID Map for fixtures
 *
 * In order to make it easier to model relationships between objects in the
 * fixtures we maintain a map of human-friendly ID's to actual UUID's for
 * the fixtures.
 */
import { v4 as uuidv4 } from 'uuid'

export default {
  userAnton: uuidv4(),
  userBerta: uuidv4(),
  userCaesar: uuidv4(),
  orgaBetreiber: uuidv4(),
  orgaKunde1: uuidv4(),
  orgaKunde2: uuidv4(),
}
