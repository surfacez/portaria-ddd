import express from "express"
import pgPromise, { IDatabase } from "pg-promise"
import CountUsersPageController from "./controllers/CountUsersPageController"
import FindFilteredUserController from "./controllers/FindFilteredUserController"
import FindGuestsInsideFilteredController from "./controllers/FindGuestsInsideFilteredController"
import FindUserByIdController from "./controllers/FindUserByIdController"
import LoginController from "./controllers/LoginController"
import RegisterUserController from "./controllers/RegisterController"
import RegisterGuestEntryController from "./controllers/RegisterGuestEntry"
import ResetPasswordController from "./controllers/ResetPasswordController"
import UpdateUserController from "./controllers/UpdateUserController"
import CountUsersPage from "./core/application/usecase/CountUsersPage"
import FindFilteredUsers from "./core/application/usecase/FindFilteredUsers"
import FindGuestInsideFiltered from "./core/application/usecase/FindGuestsInsideFiltered"
import FindUserById from "./core/application/usecase/FindUserById"
import LoginUser from "./core/application/usecase/LoginUser"
import RegisterGuestEntry from "./core/application/usecase/RegisterGuestEntry"
import RegisterUser from "./core/application/usecase/RegisterUser"
import ResetPassword from "./core/application/usecase/ResetPassword"
import UpdateUser from "./core/application/usecase/UpdateUser"
import GuestRepositoryDatabase from "./core/infra/db/GuestRepositoryDatabase"
import UserRepositoryDatabase from "./core/infra/db/UserRepositoryDatabase"
import AuthMiddleware from "./middleware"
import CountGuestsInsideFilteredPage from "./core/application/usecase/CountGuestsInsideFilteredPage"
import CountGuestsInsideFilteredPageController from "./controllers/CountGuestsInsideFilteredPageController"
import RegisterGuestDeparture from "./core/application/usecase/RegisterGuestDeparture"
import RegisterGuestDepartureController from "./controllers/RegisterGuestDepartureController"
import FindAllGuestFiltered from "./core/application/usecase/FindAllGuestFiltered"
import FindAllGuestsFilteredController from "./controllers/FindAllGuestsFilteredController"
import CountAllGuestsFilteredPageController from "./controllers/CountAllGuestsFilteredPageController"
import CountAllGuestFilteredPage from "./core/application/usecase/CountAllGuestFilteredPage"
import GuestsGenerateDataChartsController from "./controllers/GuestsGenerateDataChartsController"
import GuestsGenerateDataCharts from "./core/application/usecase/GuestsGenerateDataCharts"
import FixGuest from "./core/application/usecase/FixGuest"
import FixGuestController from "./controllers/FixGuestController"
import VerifyUsersRegisters from "./core/application/usecase/VerifyUsersRegisters"
import VerifyUsersRegistersController from "./controllers/VerifyUsersRegistersController"

let dbInstance: IDatabase<any>
export function getDbInstance() {
  if (!dbInstance) {
    const pgp = pgPromise()
    dbInstance = pgp(process.env.POSTGRES_URL!)
  }
  return dbInstance
}
//dbs
const userDb = UserRepositoryDatabase.getInstance(getDbInstance())
const guestDb = GuestRepositoryDatabase.getInstance(getDbInstance())
//express
const app = express()
app.use(express.json())

const loginUser = LoginUser.getInstance(userDb)
new LoginController(app, loginUser)
//midleware
const authMiddleware = new AuthMiddleware()
//protegidas
const registerUser = RegisterUser.getInstance(userDb)
new RegisterUserController(app, registerUser, authMiddleware)

const findFilteredUsers = FindFilteredUsers.getInstance(userDb)
new FindFilteredUserController(app, findFilteredUsers, authMiddleware)

const countUsersPage = CountUsersPage.getInstance(userDb)
new CountUsersPageController(app, countUsersPage, authMiddleware)

const findUserById = FindUserById.getInstance(userDb)
new FindUserByIdController(app, findUserById, authMiddleware)

const updateUser = UpdateUser.getInstance(userDb)
new UpdateUserController(app, updateUser, authMiddleware)

const resetPasswordUser = ResetPassword.getInstance(userDb)
new ResetPasswordController(app, resetPasswordUser, authMiddleware)

const registerGuestEntry = RegisterGuestEntry.getInstance(guestDb)
new RegisterGuestEntryController(app, registerGuestEntry, authMiddleware)

const findGuestInsideFiltered = FindGuestInsideFiltered.getInstance(guestDb)
new FindGuestsInsideFilteredController(
  app,
  findGuestInsideFiltered,
  authMiddleware
)

const countGuestsInsideFilteredPage =
  CountGuestsInsideFilteredPage.getInstance(guestDb)
new CountGuestsInsideFilteredPageController(
  app,
  countGuestsInsideFilteredPage,
  authMiddleware
)

const registerGuestDeparture = RegisterGuestDeparture.getInstance(guestDb)
new RegisterGuestDepartureController(
  app,
  registerGuestDeparture,
  authMiddleware
)

const findAllGuestsFiltered = FindAllGuestFiltered.getInstance(guestDb)
new FindAllGuestsFilteredController(app, findAllGuestsFiltered, authMiddleware)

const countAllGuestsFilteredPage =
  CountAllGuestFilteredPage.getInstance(guestDb)
new CountAllGuestsFilteredPageController(
  app,
  countAllGuestsFilteredPage,
  authMiddleware
)

const guestsGenerateDataCharts = GuestsGenerateDataCharts.getInstance(guestDb)
new GuestsGenerateDataChartsController(
  app,
  guestsGenerateDataCharts,
  authMiddleware
)

const fixGuests = FixGuest.getInstance(guestDb)
new FixGuestController(app, fixGuests, authMiddleware)

const verifyUsersRegisters = VerifyUsersRegisters.getIntance(guestDb)
new VerifyUsersRegistersController(app, verifyUsersRegisters, authMiddleware)
app.listen(3001, () => {
  console.log("Aplicação está rodando na porta 3001")
})
