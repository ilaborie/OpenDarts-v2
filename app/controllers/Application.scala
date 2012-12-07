/*
   Copyright 2012 Igor Laborie

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
package controllers

import play.api.mvc.{Action, Controller}

object Application extends Controller {
  
  def index = Action {
    Ok(views.html.index("OpenDarts v2"))
  }

  def admin = Action {
    Ok(views.html.admin("Admin"))
  }

  def charts = Action {
    Ok(views.html.charts("Charts"))
  }

  def faq = Action {
    Ok(views.html.faq())
  }
  def doc = Action {
    Ok(views.html.doc())
  }

}