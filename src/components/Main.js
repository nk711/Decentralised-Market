import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Post</h2>
              <form onSubmit = {(event) => {
                event.preventDefault()
                const description = this.postDescription.value
                this.props.uploadImage(description)
              }}>
                <input type='file' accept='.jpg, .jpeg, .png, .bmp, .gif' onChange={this.props.captureFile} />
                <div className="form-goroup mr-sm-2">
                  <br></br>

                  <input
                    id='postDescription'
                    type='text'
                    ref={(input)=> {this.postDescription = input }}
                    className = 'form-control'
                    placeholder='Post description...'
                    required />
                </div>
                <br></br>

                <button type="submit" class = "btn btn-primary btn-block btn-lg">Upload!</button>
              </form>

              <p>&nbsp;</p>
                
                {/* Code ... */}

            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;