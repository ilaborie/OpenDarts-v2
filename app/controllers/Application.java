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
package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.*;

/**
 * The Class Application.
 */
public class Application extends Controller {

	/**
	 * Index.
	 *
	 * @return the result
	 */
	public static Result index() {
		return ok(index.render("OpenDarts v2"));
 	}

  /**
   * Admin.
   *
   * @return the result
   */
  public static Result admin() {
    return ok(admin.render("Admin"));
  }

  /**
   * Admin.
   *
   * @return the result
   */
  public static Result charts() {
    return ok(charts.render("Charts"));
  }

   /**
    * Documentation.
    *
    * @return the result
    */
   public static Result doc() {
      return ok(doc.render());
   }

   /**
    * FAQ.
    *
    * @return the result
    */
   public static Result faq() {
      return ok(faq.render());
   }
}