import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from '../ProjectItem'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiUrlStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {projectsList: [], status: apiUrlStatus.initial, selection: 'ALL'}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({status: apiUrlStatus.loading})
    const {selection} = this.state
    const url = ` https://apis.ccbp.in/ps/projects?category=${selection}`
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))
      this.setState({projectsList: updateData, status: apiUrlStatus.success})
    } else {
      this.setState({status: apiUrlStatus.failure})
    }
  }

  onChangeSelection = event => {
    this.setState({selection: event.target.value}, this.getData)
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <div className="q-con">
        <ul className="app-con">
          {projectsList.map(eachData => (
            <ProjectShowCase details={eachData} key={eachData.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="ima"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="but" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderMainView = () => {
    const {status} = this.state
    switch (status) {
      case apiUrlStatus.loading:
        return this.renderLoadingView()
      case apiUrlStatus.success:
        return this.renderSuccessView()
      case apiUrlStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {selection} = this.state
    return (
      <div>
        <nav className="nav-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="web"
            alt="website logo"
          />
        </nav>
        <div className="main-con">
          <ul className="sel-con">
            <select
              className="sel"
              value={selection}
              onChange={this.onChangeSelection}
            >
              {categoriesList.map(each => (
                <option value={each.id} key={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderMainView()}
        </div>
      </div>
    )
  }
}

export default Projects
