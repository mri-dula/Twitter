class PostsController < ApplicationController
  def index
    @posts = current_user.timeline if logged_in?
    respond_to do |format|
      format.html
    end
  end

  def create
    @post = Post.create(:message => params[:message], :user_id => current_user.id)
    respond_to do |format|
      if @post.save
        format.html { redirect_to posts_path }
      else
        flash[:notice] = "Message failed to save."
        format.html { redirect_to posts_path }
      end
    end
  end
end
